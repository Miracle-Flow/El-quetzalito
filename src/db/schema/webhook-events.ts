import { jsonb, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";

export const webhookEventStatuses = ["received", "processed", "failed"] as const;

export type WebhookEventStatus = (typeof webhookEventStatuses)[number];

export const webhookEvents = commerceSchema.table("webhook_events", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 20 }).notNull(),
  providerEventId: varchar("provider_event_id", { length: 255 }).unique(),
  eventType: varchar("event_type", { length: 120 }).notNull(),
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("received"),
  errorMessage: text("error_message"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
