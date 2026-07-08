import { integer, serial, text, timestamp } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { orderLineItems } from "./order-line-items";

export const orderLineItemModifiers = commerceSchema.table("order_line_item_modifiers", {
  id: serial("id").primaryKey(),
  orderLineId: integer("order_line_id")
    .notNull()
    .references(() => orderLineItems.id),
  optionId: integer("option_id").notNull(),
  label: text("label").notNull(),
  priceDeltaCents: integer("price_delta_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
