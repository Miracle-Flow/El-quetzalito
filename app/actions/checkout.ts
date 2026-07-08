"use server";

import { and, eq, inArray, lt } from "drizzle-orm";
import { getPayload } from "payload";

import type { StoreSetting } from "@/payload-types.ts";
import config from "@/payload.config.ts";
import { db } from "@/src/db/client";
import {
  customers,
  orderLineItemModifiers,
  orderLineItems,
  orders,
  paymentIntents,
} from "@/src/db/schema";
import { computeQuote, getTodayDateInZone } from "@/src/lib/checkout/compute-quote.ts";
import {
  CheckoutInputSchema,
  QuoteResultSchema,
  type CheckoutInput,
  type QuoteResult,
} from "@/src/lib/checkout/schemas.ts";
import { createCheckoutSession } from "@/src/lib/stripe.ts";

const QuoteInputSchema = CheckoutInputSchema.partial({
  name: true,
  phone: true,
  email: true,
});

export type QuoteActionResult =
  | { success: true; quote: QuoteResult }
  | { success: false; error: string };

export type CheckoutActionResult =
  | { success: true; quote: QuoteResult; orderId: number; checkoutUrl: string }
  | {
      success: false;
      error: string;
      errors?: { lineItemId?: number; message: string }[];
    };

async function loadStoreContext() {
  const payload = await getPayload({ config });

  const storeSettings =
    ((await payload.findGlobal({
      slug: "store-settings",
    })) as StoreSetting | null) ?? ({} as Partial<StoreSetting>);

  const timeZone = storeSettings.timezone ?? "America/Guatemala";
  const today = getTodayDateInZone(timeZone);

  const [{ docs: items }, { docs: options }, { docs: availability }, { docs: promotions }] =
    await Promise.all([
      payload.find({
        collection: "menu-item",
        depth: 2,
        sort: "sortOrder",
        where: { active: { equals: true } },
        limit: 1000,
        pagination: false,
      }),
      payload.find({
        collection: "modifier-option",
        limit: 1000,
        pagination: false,
      }),
      payload.find({
        collection: "daily-availability",
        limit: 1000,
        pagination: false,
        where: { date: { equals: today } },
      }),
      payload.find({
        collection: "promotion",
        limit: 1000,
        pagination: false,
      }),
    ]);

  return {
    items,
    options,
    availability,
    promotions,
    settings: storeSettings as StoreSetting,
  };
}

export async function getQuote(input: unknown): Promise<QuoteActionResult> {
  const parseResult = QuoteInputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "Invalid checkout input." };
  }

  const context = await loadStoreContext();
  const quote = computeQuote(parseResult.data as CheckoutInput, context);

  return { success: true, quote: QuoteResultSchema.parse(quote) };
}

export async function formatValidationErrorMessage(
  errors: { lineItemId?: number; message: string }[],
): Promise<string> {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0].message;
  if (errors.length <= 3) {
    return errors.map((error) => error.message).join(" ");
  }

  return "Your cart has items that are no longer available or were updated. Please review your cart and try again.";
}

export async function submitCheckout(input: unknown): Promise<CheckoutActionResult> {
  const parseResult = CheckoutInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Invalid checkout input. Please check your details and try again.",
    };
  }

  const parsed = parseResult.data;
  const context = await loadStoreContext();
  const quote = computeQuote(parsed, context);

  if (quote.validationErrors.length > 0) {
    return {
      success: false,
      error: await formatValidationErrorMessage(quote.validationErrors),
      errors: quote.validationErrors,
    };
  }

  const insertedOrder = await db.transaction(async (tx) => {
    const customerRows = await tx
      .insert(customers)
      .values({
        name: parsed.name,
        phone: parsed.phone,
        email: parsed.email.toLowerCase(),
      })
      .onConflictDoUpdate({
        target: customers.email,
        set: {
          name: parsed.name,
          phone: parsed.phone,
          updatedAt: new Date(),
        },
      })
      .returning({ id: customers.id });

    const customerId = customerRows[0]?.id ?? null;

    const [order] = await tx
      .insert(orders)
      .values({
        status: "pending_payment",
        customerId,
        name: parsed.name,
        phone: parsed.phone,
        email: parsed.email,
        pickupMode: parsed.pickupMode,
        pickupSlot: parsed.pickupSlot ? new Date(parsed.pickupSlot) : null,
        subtotalCents: quote.subtotalCents,
        discountCents: quote.discountCents,
        taxCents: quote.taxCents,
        tipCents: quote.tipCents,
        totalCents: quote.totalCents,
        promotionId: quote.appliedPromotion?.id ?? null,
        promotionCode: quote.appliedPromotion?.code ?? null,
      })
      .returning({ id: orders.id });

    if (!order) {
      throw new Error("Failed to create order.");
    }

    const orderNumber = `EQ-${order.id.toString().padStart(4, "0")}`;
    await tx.update(orders).set({ orderNumber }).where(eq(orders.id, order.id));

    await tx.insert(paymentIntents).values({
      orderId: order.id,
      provider: "stripe",
      status: "pending",
      amountCents: quote.totalCents,
      currency: "gtq",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    for (const line of parsed.cartLines) {
      const unitCents =
        line.basePriceCents +
        line.modifiers.reduce((sum, modifier) => sum + modifier.priceDeltaCents, 0);
      const lineTotalCents = unitCents * line.quantity;

      const [orderLine] = await tx
        .insert(orderLineItems)
        .values({
          orderId: order.id,
          lineItemId: line.itemId,
          name: line.name,
          basePriceCents: line.basePriceCents,
          categoryId: line.categoryId,
          quantity: line.quantity,
          unitCents,
          lineTotalCents,
        })
        .returning({ id: orderLineItems.id });

      if (orderLine && line.modifiers.length > 0) {
        await tx.insert(orderLineItemModifiers).values(
          line.modifiers.map((modifier) => ({
            orderLineId: orderLine.id,
            optionId: modifier.optionId,
            label: modifier.label,
            priceDeltaCents: modifier.priceDeltaCents,
          })),
        );
      }
    }

    return { ...order, orderNumber };
  });

  try {
    const session = await createCheckoutSession({
      amount: quote.totalCents,
      currency: "gtq",
      orderId: insertedOrder.id,
      orderNumber: insertedOrder.orderNumber,
      customerEmail: parsed.email,
    });

    await db
      .update(paymentIntents)
      .set({
        checkoutSessionId: session.id,
        checkoutSessionUrl: session.url,
        clientSecret: session.client_secret ?? null,
      })
      .where(eq(paymentIntents.orderId, insertedOrder.id));

    return {
      success: true,
      quote: QuoteResultSchema.parse(quote),
      orderId: insertedOrder.id,
      checkoutUrl: session.url ?? "",
    };
  } catch (error) {
    console.error("[submitCheckout] failed to create Stripe checkout session", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment setup failed. Please try again.",
    };
  }
}

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

const PENDING_PAYMENT_TTL_MS = 30 * 60 * 1000;

export async function expireStalePendingOrders(tx: TransactionClient, now = new Date()) {
  const threshold = new Date(now.getTime() - PENDING_PAYMENT_TTL_MS);

  const staleOrderRows = await tx
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.status, "pending_payment"), lt(orders.createdAt, threshold)));

  if (staleOrderRows.length === 0) {
    return;
  }

  const staleOrderIds = staleOrderRows.map((row) => row.id);

  await tx.update(orders).set({ status: "cancelled" }).where(inArray(orders.id, staleOrderIds));

  await tx
    .update(paymentIntents)
    .set({ status: "cancelled", updatedAt: now })
    .where(inArray(paymentIntents.orderId, staleOrderIds));
}

export async function loadOrdersWithExpiry() {
  return db.transaction(async (tx) => {
    await expireStalePendingOrders(tx);

    const orderRows = await tx.select().from(orders).orderBy(orders.createdAt);

    if (orderRows.length === 0) {
      return [];
    }

    const orderIds = orderRows.map((order) => order.id);

    const paymentIntentRows = await tx
      .select()
      .from(paymentIntents)
      .where(inArray(paymentIntents.orderId, orderIds));

    const paymentIntentsByOrderId = new Map(paymentIntentRows.map((row) => [row.orderId, row]));

    return orderRows.map((order) => ({
      order,
      paymentIntent: paymentIntentsByOrderId.get(order.id) ?? null,
    }));
  });
}

export async function loadOrderWithExpiry(orderId: number) {
  return db.transaction(async (tx) => {
    await expireStalePendingOrders(tx);

    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      return null;
    }

    const lineItems = await tx
      .select()
      .from(orderLineItems)
      .where(eq(orderLineItems.orderId, orderId));

    const lineItemIds = lineItems.map((line) => line.id);
    const modifiers =
      lineItemIds.length > 0
        ? await tx
            .select()
            .from(orderLineItemModifiers)
            .where(inArray(orderLineItemModifiers.orderLineId, lineItemIds))
        : [];

    const [paymentIntent] = await tx
      .select()
      .from(paymentIntents)
      .where(eq(paymentIntents.orderId, orderId));

    return {
      order,
      lineItems,
      modifiers,
      paymentIntent: paymentIntent ?? null,
    };
  });
}
