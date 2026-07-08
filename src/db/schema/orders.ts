import { integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { customers } from "./customers";

export const orderStatuses = [
  "pending_payment",
  "paid",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const orders = commerceSchema.table("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).unique(),
  status: varchar("status", { length: 30 }).notNull().default("pending_payment"),
  customerId: integer("customer_id").references(() => customers.id),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 120 }).notNull(),
  pickupMode: varchar("pickup_mode", { length: 20 }).notNull(),
  pickupSlot: timestamp("pickup_slot", { withTimezone: true }),
  subtotalCents: integer("subtotal_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  tipCents: integer("tip_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  promotionId: integer("promotion_id"),
  promotionCode: varchar("promotion_code", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
