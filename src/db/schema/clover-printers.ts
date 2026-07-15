import { boolean, integer, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

import { commerceSchema } from "../client";
import { cloverDevices } from "./clover-devices";

export const cloverPrinters = commerceSchema.table(
  "clover_printers",
  {
    id: serial("id").primaryKey(),
    deviceId: integer("device_id")
      .notNull()
      .references(() => cloverDevices.id),
    cloverPrinterId: varchar("clover_printer_id", { length: 40 }).notNull(),
    name: text("name"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("clover_printers_device_printer_unique").on(table.deviceId, table.cloverPrinterId),
  ],
);
