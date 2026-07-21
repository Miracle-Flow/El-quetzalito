import { boolean, integer, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { cloverMerchants } from "./clover-merchants";

export const cloverDeviceStatuses = ["active", "inactive"] as const;

export type CloverDeviceStatus = (typeof cloverDeviceStatuses)[number];

export const cloverDevices = commerceSchema.table("clover_devices", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id")
    .notNull()
    .references(() => cloverMerchants.id),
  serial: varchar("serial", { length: 40 }).notNull().unique(),
  nickname: text("nickname"),
  isFiringDevice: boolean("is_firing_device").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
