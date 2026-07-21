import { eq } from "drizzle-orm";

import { db } from "@/src/db/client";
import { cloverPrinters } from "@/src/db/schema";

import type { CloverClient } from "./client";

// Discovers printers attached to a device and upserts them into clover_printers.
// The first discovered printer is marked as the default. Run during merchant onboarding.
export async function syncDevicePrinters(
  deviceId: number,
  client: CloverClient,
  deviceSerial: string,
): Promise<void> {
  const printers = await client.listPrinters({ deviceSerial });

  for (const [index, printer] of printers.entries()) {
    await db
      .insert(cloverPrinters)
      .values({
        deviceId,
        cloverPrinterId: printer.id,
        name: printer.name,
        isDefault: index === 0,
      })
      .onConflictDoUpdate({
        target: [cloverPrinters.deviceId, cloverPrinters.cloverPrinterId],
        set: {
          name: printer.name,
          updatedAt: new Date(),
        },
      });
  }

  if (printers.length > 0) {
    console.info(`[clover setup] synced ${printers.length} printer(s) for device=${deviceSerial}`);
  }
}

export async function clearDevicePrinters(deviceId: number): Promise<void> {
  await db.delete(cloverPrinters).where(eq(cloverPrinters.deviceId, deviceId));
}
