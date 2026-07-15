import { integer, jsonb, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { cloverDevices } from "./clover-devices";
import { cloverPrinters } from "./clover-printers";
import { orders } from "./orders";

export const printJobStatuses = ["queued", "printing", "sent", "failed", "cancelled"] as const;

export type PrintJobStatus = (typeof printJobStatuses)[number];

export const printJob = commerceSchema.table(
  "print_jobs",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    deviceId: integer("device_id").references(() => cloverDevices.id),
    printerId: integer("printer_id").references(() => cloverPrinters.id),
    provider: varchar("provider", { length: 20 }).notNull().default("clover"),
    status: varchar("status", { length: 30 }).notNull().default("queued"),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).notNull().defaultNow(),
    lastError: text("last_error"),
    lastJobId: varchar("last_job_id", { length: 60 }),
    payload: jsonb("payload").notNull().default({}),
    printedAt: timestamp("printed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("print_jobs_order_unique").on(table.orderId)],
);

export type PrintJob = typeof printJob.$inferSelect;
