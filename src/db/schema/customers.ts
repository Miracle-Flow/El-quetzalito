import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";

export const customers = commerceSchema.table("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
