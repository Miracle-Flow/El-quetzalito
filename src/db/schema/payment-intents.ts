import { integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { orders } from "./orders";

export const paymentIntentStatuses = [
  "pending",
  "requires_action",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
] as const;

export type PaymentIntentStatus = (typeof paymentIntentStatuses)[number];

export const paymentIntents = commerceSchema.table("payment_intents", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id)
    .unique(),
  provider: varchar("provider", { length: 20 }).notNull().default("stripe"),
  providerPaymentIntentId: varchar("provider_payment_intent_id", {
    length: 255,
  }),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  amountCents: integer("amount_cents").notNull(),
  amountReceivedCents: integer("amount_received_cents"),
  currency: varchar("currency", { length: 3 }).notNull().default("usd"),
  checkoutSessionUrl: text("checkout_session_url"),
  checkoutSessionId: varchar("checkout_session_id", { length: 255 }),
  clientSecret: text("client_secret"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
