import { serial, text, timestamp } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";

export const migrationCheck = commerceSchema.table("migration_check", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
