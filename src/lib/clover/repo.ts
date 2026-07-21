import { and, asc, eq, inArray, lte } from "drizzle-orm";

import { db } from "@/src/db/client";
import {
  cloverDevices,
  cloverMerchants,
  cloverPrinters,
  orderLineItemModifiers,
  orderLineItems,
  orders,
  paymentIntents,
  printJob,
} from "@/src/db/schema";

export type ClaimedPrintJob = typeof printJob.$inferSelect;

export function claimNextPrintJob(now = new Date()): Promise<ClaimedPrintJob | null> {
  return db.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(printJob)
      .where(and(inArray(printJob.status, ["queued", "failed"]), lte(printJob.nextAttemptAt, now)))
      .orderBy(asc(printJob.id))
      .for("update", { skipLocked: true })
      .limit(1);

    const job = rows[0];
    if (!job) {
      return null;
    }

    await tx
      .update(printJob)
      .set({ status: "printing", updatedAt: now })
      .where(eq(printJob.id, job.id));

    return job;
  });
}

export async function reschedulePrintJob(
  id: number,
  input: { attempts: number; nextAttemptAt: Date; error: string },
): Promise<void> {
  await db
    .update(printJob)
    .set({
      status: "queued",
      attempts: input.attempts,
      nextAttemptAt: input.nextAttemptAt,
      lastError: input.error,
      updatedAt: new Date(),
    })
    .where(eq(printJob.id, id));
}

export async function markPrintJobSent(id: number, cloverJobId: string | undefined): Promise<void> {
  await db
    .update(printJob)
    .set({
      status: "sent",
      lastJobId: cloverJobId ?? null,
      lastError: null,
      printedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(printJob.id, id));
}

export async function markPrintJobFailed(id: number, error: string): Promise<void> {
  await db
    .update(printJob)
    .set({ status: "failed", lastError: error, updatedAt: new Date() })
    .where(eq(printJob.id, id));
}

export async function getFiringDevice() {
  const rows = await db
    .select()
    .from(cloverDevices)
    .where(and(eq(cloverDevices.isFiringDevice, true), eq(cloverDevices.status, "active")))
    .limit(1);
  return rows[0] ?? null;
}

export async function getMerchant(id: number) {
  const rows = await db.select().from(cloverMerchants).where(eq(cloverMerchants.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getDefaultPrinter(deviceId: number) {
  const rows = await db.select().from(cloverPrinters).where(eq(cloverPrinters.deviceId, deviceId));
  return rows.find((printer) => printer.isDefault) ?? rows[0] ?? null;
}

export interface OrderReceiptData {
  order: typeof orders.$inferSelect;
  paymentIntent: typeof paymentIntents.$inferSelect | null;
  items: (typeof orderLineItems.$inferSelect)[];
  modifiers: (typeof orderLineItemModifiers.$inferSelect)[];
}

export async function getOrderReceiptData(orderId: number): Promise<OrderReceiptData | null> {
  const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  const order = orderRows[0];
  if (!order) {
    return null;
  }

  const paymentIntentRows = await db
    .select()
    .from(paymentIntents)
    .where(eq(paymentIntents.orderId, orderId))
    .limit(1);

  const items = await db
    .select()
    .from(orderLineItems)
    .where(eq(orderLineItems.orderId, orderId))
    .orderBy(asc(orderLineItems.id));

  const modifiers =
    items.length > 0
      ? await db
          .select()
          .from(orderLineItemModifiers)
          .where(
            inArray(
              orderLineItemModifiers.orderLineId,
              items.map((item) => item.id),
            ),
          )
      : [];

  return {
    order,
    paymentIntent: paymentIntentRows[0] ?? null,
    items,
    modifiers,
  };
}
