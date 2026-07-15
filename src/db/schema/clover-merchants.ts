import { serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";

export const cloverMerchants = commerceSchema.table("clover_merchants", {
  id: serial("id").primaryKey(),
  cloverMerchantId: varchar("clover_merchant_id", { length: 60 }).notNull().unique(),
  merchantName: text("merchant_name"),
  accessToken: varchar("access_token", { length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }).notNull(),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }).notNull(),
  apiBaseUrl: text("api_base_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
