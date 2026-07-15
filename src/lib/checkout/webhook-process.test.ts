import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type Stripe from "stripe";

import { processStripeWebhookEvent } from "../../../app/api/stripe/webhook/process.ts";
import type { WebhookStore } from "../../../app/api/stripe/webhook/store.ts";

type OrderStatus = "pending_payment" | "paid" | "ready" | "completed" | "cancelled";

type PaymentIntentStatus =
  | "pending"
  | "requires_action"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

interface OrderRecord {
  id: number;
  orderNumber: string | null;
  status: OrderStatus;
  customerId: number | null;
  name: string;
  phone: string;
  email: string;
  pickupMode: string;
  pickupSlot: Date | null;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  promotionId: number | null;
  promotionCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentIntentRecord {
  id: number;
  orderId: number;
  provider: string;
  providerPaymentIntentId: string | null;
  status: PaymentIntentStatus;
  amountCents: number;
  amountReceivedCents: number | null;
  currency: string;
  checkoutSessionUrl: string | null;
  checkoutSessionId: string | null;
  clientSecret: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class InMemoryWebhookStore implements WebhookStore {
  private readonly webhookEvents = new Map<number, WebhookEventRecord>();
  private readonly webhookEventsByProviderId = new Map<string, number>();
  private readonly orderRecords = new Map<number, OrderRecord>();
  private readonly paymentIntentRecords = new Map<number, PaymentIntentRecord>();
  private nextWebhookEventId = 1;
  private nextOrderId = 1;
  private nextPaymentIntentId = 1;

  public async findWebhookEventByProviderEventId(providerEventId: string) {
    const id = this.webhookEventsByProviderId.get(providerEventId);
    if (id === undefined) {
      return null;
    }
    const record = this.webhookEvents.get(id);
    return record ? { id: record.id } : null;
  }

  public async insertWebhookEvent(input: {
    provider: string;
    providerEventId: string;
    eventType: string;
    payload: object;
    status: string;
  }) {
    const id = this.nextWebhookEventId++;
    const record: WebhookEventRecord = {
      id,
      provider: input.provider,
      providerEventId: input.providerEventId,
      eventType: input.eventType,
      payload: input.payload,
      status: input.status as WebhookEventStatus,
      errorMessage: null,
      processedAt: null,
      createdAt: new Date(),
    };
    this.webhookEvents.set(id, record);
    this.webhookEventsByProviderId.set(input.providerEventId, id);
    return { id };
  }

  public async markWebhookEventProcessed(id: number) {
    const record = this.webhookEvents.get(id);
    if (record) {
      record.status = "processed";
      record.processedAt = new Date();
    }
  }

  public async markWebhookEventFailed(id: number, errorMessage: string) {
    const record = this.webhookEvents.get(id);
    if (record) {
      record.status = "failed";
      record.errorMessage = errorMessage;
    }
  }

  public async findOrderById(orderId: number) {
    return this.orderRecords.get(orderId) ?? null;
  }

  public async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = this.orderRecords.get(orderId);
    if (order) {
      order.status = status;
    }
  }

  public async findPaymentIntentByOrderId(orderId: number) {
    for (const record of this.paymentIntentRecords.values()) {
      if (record.orderId === orderId) {
        return record;
      }
    }
    return null;
  }

  public async findOrderIdByProviderPaymentIntentId(providerPaymentIntentId: string) {
    for (const record of this.paymentIntentRecords.values()) {
      if (record.providerPaymentIntentId === providerPaymentIntentId) {
        return record.orderId;
      }
    }
    return null;
  }

  public async updatePaymentIntent(
    id: number,
    data: {
      status?: PaymentIntentStatus;
      providerPaymentIntentId?: string | null;
      amountReceivedCents?: number | null;
      updatedAt?: Date;
    },
  ) {
    const record = this.paymentIntentRecords.get(id);
    if (!record) {
      return;
    }
    if (data.status !== undefined) {
      record.status = data.status;
    }
    if (data.providerPaymentIntentId !== undefined) {
      record.providerPaymentIntentId = data.providerPaymentIntentId;
    }
    if (data.amountReceivedCents !== undefined) {
      record.amountReceivedCents = data.amountReceivedCents;
    }
    if (data.updatedAt !== undefined) {
      record.updatedAt = data.updatedAt;
    }
  }

  private readonly enqueuedPrintJobs = new Set<number>();

  public async enqueuePrintJob(orderId: number) {
    this.enqueuedPrintJobs.add(orderId);
  }

  public getEnqueuedPrintJobs(): number[] {
    return [...this.enqueuedPrintJobs];
  }

  public seedOrder(
    overrides: Partial<OrderRecord> & { totalCents: number; status: OrderStatus },
  ): OrderRecord {
    const id = this.nextOrderId++;
    const now = new Date();
    const order: OrderRecord = {
      id,
      orderNumber: `ORD-${id}`,
      status: overrides.status,
      customerId: overrides.customerId ?? null,
      name: overrides.name ?? "Test Customer",
      phone: overrides.phone ?? "555-0000",
      email: overrides.email ?? "test@example.com",
      pickupMode: overrides.pickupMode ?? "pickup",
      pickupSlot: overrides.pickupSlot ?? null,
      subtotalCents: overrides.subtotalCents ?? overrides.totalCents,
      discountCents: overrides.discountCents ?? 0,
      taxCents: overrides.taxCents ?? 0,
      tipCents: overrides.tipCents ?? 0,
      totalCents: overrides.totalCents,
      promotionId: overrides.promotionId ?? null,
      promotionCode: overrides.promotionCode ?? null,
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now,
    };
    this.orderRecords.set(id, order);
    return order;
  }

  public seedPaymentIntent(
    overrides: Partial<PaymentIntentRecord> & {
      orderId: number;
      status: PaymentIntentStatus;
      amountCents: number;
    },
  ): PaymentIntentRecord {
    const id = this.nextPaymentIntentId++;
    const now = new Date();
    const paymentIntent: PaymentIntentRecord = {
      id,
      orderId: overrides.orderId,
      provider: overrides.provider ?? "stripe",
      providerPaymentIntentId: overrides.providerPaymentIntentId ?? null,
      status: overrides.status,
      amountCents: overrides.amountCents,
      amountReceivedCents: overrides.amountReceivedCents ?? null,
      currency: overrides.currency ?? "gtq",
      checkoutSessionUrl: overrides.checkoutSessionUrl ?? null,
      checkoutSessionId: overrides.checkoutSessionId ?? null,
      clientSecret: overrides.clientSecret ?? null,
      expiresAt: overrides.expiresAt ?? null,
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now,
    };
    this.paymentIntentRecords.set(id, paymentIntent);
    return paymentIntent;
  }

  public getWebhookEventByProviderEventId(providerEventId: string) {
    const id = this.webhookEventsByProviderId.get(providerEventId);
    return id === undefined ? null : (this.webhookEvents.get(id) ?? null);
  }
}

type WebhookEventStatus = "received" | "processed" | "failed";

interface WebhookEventRecord {
  id: number;
  provider: string;
  providerEventId: string;
  eventType: string;
  payload: object;
  status: WebhookEventStatus;
  errorMessage: string | null;
  processedAt: Date | null;
  createdAt: Date;
}

function makeCheckoutSessionCompletedEvent(overrides: {
  id: string;
  sessionId: string;
  orderId: number;
  paymentIntentId: string;
  amountTotal: number;
}): Stripe.Event {
  return {
    id: overrides.id,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: overrides.sessionId,
        object: "checkout.session",
        metadata: { orderId: String(overrides.orderId) },
        payment_intent: overrides.paymentIntentId,
        amount_total: overrides.amountTotal,
      } as unknown as Stripe.Checkout.Session,
    },
  } as unknown as Stripe.Event;
}

function makeChargeRefundedEvent(overrides: {
  id: string;
  orderId: number;
  paymentIntentId: string;
  amountRefunded: number;
}): Stripe.Event {
  return {
    id: overrides.id,
    object: "event",
    type: "charge.refunded",
    data: {
      object: {
        id: "ch_test",
        object: "charge",
        metadata: { orderId: String(overrides.orderId) },
        payment_intent: overrides.paymentIntentId,
        amount_refunded: overrides.amountRefunded,
      } as unknown as Stripe.Charge,
    },
  } as unknown as Stripe.Event;
}

function makeCheckoutSessionExpiredEvent(overrides: {
  id: string;
  sessionId: string;
  orderId: number;
}): Stripe.Event {
  return {
    id: overrides.id,
    object: "event",
    type: "checkout.session.expired",
    data: {
      object: {
        id: overrides.sessionId,
        object: "checkout.session",
        metadata: { orderId: String(overrides.orderId) },
      } as unknown as Stripe.Checkout.Session,
    },
  } as unknown as Stripe.Event;
}

describe("processStripeWebhookEvent", () => {
  it("checkout.session.completed marks order paid and payment intent succeeded", async () => {
    const store = new InMemoryWebhookStore();
    const order = store.seedOrder({ totalCents: 2500, status: "pending_payment" });
    store.seedPaymentIntent({
      orderId: order.id,
      status: "pending",
      amountCents: 2500,
    });

    const event = makeCheckoutSessionCompletedEvent({
      id: "evt_complete_1",
      sessionId: "cs_test_1",
      orderId: order.id,
      paymentIntentId: "pi_test_1",
      amountTotal: 2500,
    });

    const result = await processStripeWebhookEvent(event, store);

    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.message, "OK");

    const updatedOrder = await store.findOrderById(order.id);
    assert.strictEqual(updatedOrder?.status, "paid");

    const updatedPaymentIntent = await store.findPaymentIntentByOrderId(order.id);
    assert.strictEqual(updatedPaymentIntent?.status, "succeeded");
    assert.strictEqual(updatedPaymentIntent?.providerPaymentIntentId, "pi_test_1");
    assert.strictEqual(updatedPaymentIntent?.amountReceivedCents, 2500);

    const webhookRecord = store.getWebhookEventByProviderEventId("evt_complete_1");
    assert.strictEqual(webhookRecord?.status, "processed");
  });

  it("duplicate event id is a no-op", async () => {
    const store = new InMemoryWebhookStore();
    const order = store.seedOrder({ totalCents: 2500, status: "pending_payment" });
    store.seedPaymentIntent({
      orderId: order.id,
      status: "pending",
      amountCents: 2500,
    });

    const event = makeCheckoutSessionCompletedEvent({
      id: "evt_duplicate_1",
      sessionId: "cs_test_dup",
      orderId: order.id,
      paymentIntentId: "pi_test_dup",
      amountTotal: 2500,
    });

    const firstResult = await processStripeWebhookEvent(event, store);
    assert.strictEqual(firstResult.status, 200);

    await store.updateOrderStatus(order.id, "pending_payment");
    const paymentIntent = await store.findPaymentIntentByOrderId(order.id);
    assert.ok(paymentIntent);
    await store.updatePaymentIntent(paymentIntent.id, {
      status: "pending",
      providerPaymentIntentId: null,
      amountReceivedCents: null,
      updatedAt: new Date(),
    });

    const secondResult = await processStripeWebhookEvent(event, store);
    assert.strictEqual(secondResult.status, 200);
    assert.strictEqual(secondResult.message, "Event already processed");

    const reloadedOrder = await store.findOrderById(order.id);
    assert.strictEqual(reloadedOrder?.status, "pending_payment");

    const reloadedPaymentIntent = await store.findPaymentIntentByOrderId(order.id);
    assert.strictEqual(reloadedPaymentIntent?.status, "pending");
    assert.strictEqual(reloadedPaymentIntent?.providerPaymentIntentId, null);
    assert.strictEqual(reloadedPaymentIntent?.amountReceivedCents, null);
  });

  it("charge.refunded cancels order and refunds payment intent", async () => {
    const store = new InMemoryWebhookStore();
    const order = store.seedOrder({ totalCents: 1800, status: "paid" });
    store.seedPaymentIntent({
      orderId: order.id,
      status: "succeeded",
      amountCents: 1800,
      providerPaymentIntentId: "pi_refund_1",
      amountReceivedCents: 1800,
    });

    const event = makeChargeRefundedEvent({
      id: "evt_refund_1",
      orderId: order.id,
      paymentIntentId: "pi_refund_1",
      amountRefunded: 1800,
    });

    const result = await processStripeWebhookEvent(event, store);

    assert.strictEqual(result.status, 200);

    const updatedOrder = await store.findOrderById(order.id);
    assert.strictEqual(updatedOrder?.status, "cancelled");

    const updatedPaymentIntent = await store.findPaymentIntentByOrderId(order.id);
    assert.strictEqual(updatedPaymentIntent?.status, "refunded");
    assert.strictEqual(updatedPaymentIntent?.amountReceivedCents, 0);
  });

  it("checkout.session.expired cancels a pending payment order", async () => {
    const store = new InMemoryWebhookStore();
    const order = store.seedOrder({ totalCents: 1200, status: "pending_payment" });
    store.seedPaymentIntent({
      orderId: order.id,
      status: "pending",
      amountCents: 1200,
    });

    const event = makeCheckoutSessionExpiredEvent({
      id: "evt_expired_1",
      sessionId: "cs_expired_1",
      orderId: order.id,
    });

    const result = await processStripeWebhookEvent(event, store);

    assert.strictEqual(result.status, 200);

    const updatedOrder = await store.findOrderById(order.id);
    assert.strictEqual(updatedOrder?.status, "cancelled");

    const updatedPaymentIntent = await store.findPaymentIntentByOrderId(order.id);
    assert.strictEqual(updatedPaymentIntent?.status, "cancelled");
  });
});
