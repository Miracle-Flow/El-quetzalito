import { integer, serial, text, timestamp } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { orders } from "./orders";

export const orderLineItems = commerceSchema.table("order_line_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  lineItemId: integer("line_item_id").notNull(),
  name: text("name").notNull(),
  basePriceCents: integer("base_price_cents").notNull(),
  categoryId: integer("category_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitCents: integer("unit_cents").notNull(),
  lineTotalCents: integer("line_total_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
