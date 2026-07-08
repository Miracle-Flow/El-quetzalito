import type Stripe from "stripe";

import type { WebhookStore } from "./store";

type ProcessResult = {
  status: number;
  message: string;
};

function getStringId(value: string | { id: string } | null | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "id" in value) {
    return value.id;
  }

  return null;
}

export async function processStripeWebhookEvent(
  event: Stripe.Event,
  store: WebhookStore,
): Promise<ProcessResult> {
  const existing = await store.findWebhookEventByProviderEventId(event.id);

  if (existing) {
    return { status: 200, message: "Event already processed" };
  }

  const record = await store.insertWebhookEvent({
    provider: "stripe",
    providerEventId: event.id,
    eventType: event.type,
    payload: event,
    status: "received",
  });

  const markFailed = async (message: string, cause?: unknown) => {
    console.error(`[stripe webhook] ${event.id} failed: ${message}`, cause);
    await store.markWebhookEventFailed(record.id, message);
    return { status: 500, message };
  };

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(store, event.data.object);
    } else if (event.type === "charge.refunded") {
      await handleChargeRefunded(store, event.data.object);
    } else if (event.type === "refund.updated") {
      await handleRefundUpdated(store, event.data.object);
    } else if (event.type === "checkout.session.expired") {
      await handleCheckoutSessionExpired(store, event.data.object);
    } else {
      await store.markWebhookEventProcessed(record.id);
      return { status: 200, message: "Event received" };
    }

    await store.markWebhookEventProcessed(record.id);
    console.info(`[stripe webhook] ${event.id} processed`);
    return { status: 200, message: "OK" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return markFailed(message, error);
  }
}

async function handleCheckoutSessionCompleted(
  store: WebhookStore,
  session: Stripe.Checkout.Session,
) {
  const orderId = resolveOrderId(session.metadata);
  if (!orderId) {
    throw new Error("checkout.session.completed is missing orderId metadata");
  }

  const order = await store.findOrderById(orderId);

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (order.status !== "pending_payment") {
    throw new Error(`Order ${orderId} has unexpected status "${order.status}"`);
  }

  const paymentIntent = await store.findPaymentIntentByOrderId(orderId);

  if (!paymentIntent) {
    throw new Error(`Payment intent for order ${orderId} not found`);
  }

  const providerPaymentId = getStringId(session.payment_intent) ?? session.id;
  const amountReceived = session.amount_total ?? order.totalCents;

  await store.updateOrderStatus(orderId, "paid");
  await store.updatePaymentIntent(paymentIntent.id, {
    status: "succeeded",
    providerPaymentIntentId: providerPaymentId,
    amountReceivedCents: amountReceived,
    updatedAt: new Date(),
  });

  console.info(`[stripe webhook] checkout.session.completed order=${orderId} event=${session.id}`);
}

async function handleChargeRefunded(store: WebhookStore, charge: Stripe.Charge) {
  const orderId = charge.metadata?.orderId ? Number(charge.metadata.orderId) : null;

  const order = orderId
    ? await store.findOrderById(orderId)
    : await fetchOrderByPaymentIntentId(store, getStringId(charge.payment_intent));

  if (!order) {
    throw new Error("No order found for charge.refunded");
  }

  await applyRefund(store, order, charge.amount_refunded);
}

async function handleRefundUpdated(store: WebhookStore, refund: Stripe.Refund) {
  const orderId = refund.metadata?.orderId ? Number(refund.metadata.orderId) : null;

  const order = orderId
    ? await store.findOrderById(orderId)
    : await fetchOrderByPaymentIntentId(store, getStringId(refund.payment_intent));

  if (!order) {
    throw new Error("No order found for refund.updated");
  }

  await applyRefund(store, order, refund.amount);
}

async function handleCheckoutSessionExpired(store: WebhookStore, session: Stripe.Checkout.Session) {
  const orderId = resolveOrderId(session.metadata);
  if (!orderId) {
    return;
  }

  const order = await store.findOrderById(orderId);
  if (order?.status !== "pending_payment") {
    return;
  }

  await store.updateOrderStatus(orderId, "cancelled");

  const paymentIntent = await store.findPaymentIntentByOrderId(orderId);
  if (paymentIntent) {
    await store.updatePaymentIntent(paymentIntent.id, {
      status: "cancelled",
      updatedAt: new Date(),
    });
  }

  console.info(`[stripe webhook] checkout.session.expired order=${orderId} event=${session.id}`);
}

async function fetchOrderByPaymentIntentId(store: WebhookStore, paymentIntentId: string | null) {
  if (!paymentIntentId) {
    return null;
  }

  const orderId = await store.findOrderIdByProviderPaymentIntentId(paymentIntentId);
  if (!orderId) {
    return null;
  }

  return store.findOrderById(orderId);
}

async function applyRefund(
  store: WebhookStore,
  order: { id: number; status: string; totalCents: number },
  refundAmountCents: number,
) {
  const paymentIntent = await store.findPaymentIntentByOrderId(order.id);

  if (!paymentIntent) {
    throw new Error(`Payment intent for order ${order.id} not found`);
  }

  if (order.status === "paid" && refundAmountCents >= order.totalCents) {
    await store.updateOrderStatus(order.id, "cancelled");
  }

  await store.updatePaymentIntent(paymentIntent.id, {
    status: "refunded",
    amountReceivedCents: Math.max(0, order.totalCents - refundAmountCents),
    updatedAt: new Date(),
  });

  console.info(`[stripe webhook] refund order=${order.id} amount=${refundAmountCents}`);
}

function resolveOrderId(metadata: Record<string, string> | null | undefined): number | null {
  if (!metadata?.orderId) {
    return null;
  }

  const parsed = Number(metadata.orderId);
  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}
