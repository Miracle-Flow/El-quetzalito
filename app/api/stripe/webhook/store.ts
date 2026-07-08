import { eq } from "drizzle-orm";

import type { db } from "@/src/db/client";
import {
  orders,
  paymentIntents,
  webhookEvents,
  type OrderStatus,
  type PaymentIntentStatus,
} from "@/src/db/schema";

export type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface WebhookStore {
  findWebhookEventByProviderEventId: (providerEventId: string) => Promise<{ id: number } | null>;
  insertWebhookEvent: (input: {
    provider: string;
    providerEventId: string;
    eventType: string;
    payload: object;
    status: string;
  }) => Promise<{ id: number }>;
  markWebhookEventProcessed: (id: number) => Promise<void>;
  markWebhookEventFailed: (id: number, errorMessage: string) => Promise<void>;
  findOrderById: (orderId: number) => Promise<typeof orders.$inferSelect | null>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  findPaymentIntentByOrderId: (
    orderId: number,
  ) => Promise<typeof paymentIntents.$inferSelect | null>;
  findOrderIdByProviderPaymentIntentId: (providerPaymentIntentId: string) => Promise<number | null>;
  updatePaymentIntent: (
    id: number,
    data: {
      status?: PaymentIntentStatus;
      providerPaymentIntentId?: string | null;
      amountReceivedCents?: number | null;
      updatedAt?: Date;
    },
  ) => Promise<void>;
}

export function createDrizzleWebhookStore(tx: TransactionClient): WebhookStore {
  return {
    async findWebhookEventByProviderEventId(providerEventId) {
      const rows = await tx
        .select({ id: webhookEvents.id })
        .from(webhookEvents)
        .where(eq(webhookEvents.providerEventId, providerEventId));
      return rows[0] ?? null;
    },

    async insertWebhookEvent(input) {
      const rows = await tx
        .insert(webhookEvents)
        .values({
          provider: input.provider,
          providerEventId: input.providerEventId,
          eventType: input.eventType,
          payload: input.payload,
          status: input.status,
        })
        .returning({ id: webhookEvents.id });
      const row = rows[0];
      if (!row) {
        throw new Error("Failed to insert webhook event");
      }
      return row;
    },

    async markWebhookEventProcessed(id) {
      await tx
        .update(webhookEvents)
        .set({ status: "processed", processedAt: new Date() })
        .where(eq(webhookEvents.id, id));
    },

    async markWebhookEventFailed(id, errorMessage) {
      await tx
        .update(webhookEvents)
        .set({ status: "failed", errorMessage })
        .where(eq(webhookEvents.id, id));
    },

    async findOrderById(orderId) {
      const rows = await tx.select().from(orders).where(eq(orders.id, orderId));
      return rows[0] ?? null;
    },

    async updateOrderStatus(orderId, status) {
      await tx.update(orders).set({ status }).where(eq(orders.id, orderId));
    },

    async findPaymentIntentByOrderId(orderId) {
      const rows = await tx
        .select()
        .from(paymentIntents)
        .where(eq(paymentIntents.orderId, orderId));
      return rows[0] ?? null;
    },

    async findOrderIdByProviderPaymentIntentId(providerPaymentIntentId) {
      const rows = await tx
        .select({ orderId: paymentIntents.orderId })
        .from(paymentIntents)
        .where(eq(paymentIntents.providerPaymentIntentId, providerPaymentIntentId));
      return rows[0]?.orderId ?? null;
    },

    async updatePaymentIntent(id, data) {
      await tx.update(paymentIntents).set(data).where(eq(paymentIntents.id, id));
    },
  };
}
