import { getStripe } from "@/src/lib/stripe";

import { getValidAccessToken } from "./auth";
import { createHttpCloverClient, type CloverClient } from "./client";
import { renderReceipt, type ReceiptPayment } from "./receipt";
import {
  claimNextPrintJob,
  getDefaultPrinter,
  getFiringDevice,
  getMerchant,
  getOrderReceiptData,
  markPrintJobFailed,
  markPrintJobSent,
  reschedulePrintJob,
  type ClaimedPrintJob,
} from "./repo";

export interface DrainOptions {
  limit?: number;
  client?: CloverClient;
}

export async function drainPrintQueue(options: DrainOptions = {}): Promise<number> {
  const limit = Math.max(1, options.limit ?? 25);
  let processed = 0;

  for (let index = 0; index < limit; index += 1) {
    const hadJob = await processNext(options.client);
    if (!hadJob) {
      break;
    }
    processed += 1;
  }

  return processed;
}

async function processNext(clientOverride?: CloverClient): Promise<boolean> {
  const job = await claimNextPrintJob();
  if (!job) {
    return false;
  }

  const device = await getFiringDevice();
  if (!device) {
    await failOrReschedule(job, "No active firing device configured");
    return true;
  }

  const printer = await getDefaultPrinter(device.id);
  if (!printer) {
    await failOrReschedule(job, `No printer configured for device ${device.serial}`);
    return true;
  }

  const merchant = await getMerchant(device.merchantId);
  if (!merchant) {
    await failOrReschedule(job, `Merchant for device ${device.serial} not found`);
    return true;
  }

  const receiptData = await getOrderReceiptData(job.orderId);
  if (!receiptData) {
    await markPrintJobFailed(job.id, `Order ${job.orderId} not found`);
    return true;
  }

  const payment = await resolvePaymentDetails(
    receiptData.paymentIntent?.providerPaymentIntentId ?? null,
  );
  const text = renderReceipt({
    merchantName: merchant.merchantName ?? "El Quetzalito",
    orderNumber: receiptData.order.orderNumber ?? `EQ-${receiptData.order.id}`,
    createdAt: receiptData.order.createdAt,
    pickupMode: receiptData.order.pickupMode,
    pickupSlot: receiptData.order.pickupSlot,
    currency: receiptData.paymentIntent?.currency ?? "usd",
    subtotalCents: receiptData.order.subtotalCents,
    discountCents: receiptData.order.discountCents,
    taxCents: receiptData.order.taxCents,
    tipCents: receiptData.order.tipCents,
    totalCents: receiptData.order.totalCents,
    promotionCode: receiptData.order.promotionCode,
    items: receiptData.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitCents: item.unitCents,
      lineTotalCents: item.lineTotalCents,
      modifiers: receiptData.modifiers
        .filter((modifier) => modifier.orderLineId === item.id)
        .map((modifier) => ({
          label: modifier.label,
          priceDeltaCents: modifier.priceDeltaCents,
        })),
    })),
    payment,
  });

  const client =
    clientOverride ??
    createHttpCloverClient({
      baseUrl: merchant.apiBaseUrl,
      posId: process.env.CLOVER_POS_ID ?? "el-quetzalito",
      getAccessToken: () => getValidAccessToken(merchant),
    });

  try {
    const result = await client.printText({
      deviceSerial: device.serial,
      printerId: printer.cloverPrinterId,
      text,
      idempotencyKey: `eq-order-${job.orderId}`,
    });

    if (result.ok) {
      await markPrintJobSent(job.id, result.jobId);
      console.info(`[clover] printed order=${job.orderId} jobId=${result.jobId ?? "?"}`);
      return true;
    }

    await failOrReschedule(
      job,
      `Clover print failed (${result.status}): ${result.error ?? "unknown"}`,
    );
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected print error";
    await failOrReschedule(job, message);
    return true;
  }
}

async function resolvePaymentDetails(
  providerPaymentIntentId: string | null,
): Promise<ReceiptPayment | null> {
  if (!providerPaymentIntentId) {
    return null;
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(providerPaymentIntentId, {
      expand: ["latest_charge"],
    });

    const charge =
      typeof paymentIntent.latest_charge === "string" ? null : paymentIntent.latest_charge;

    const card =
      (charge?.payment_method_details as { card?: { brand?: string; last4?: string } } | null)
        ?.card ?? null;

    return {
      brand: card?.brand ?? null,
      last4: card?.last4 ?? null,
      reference: charge?.id ?? paymentIntent.id,
      authCode: null,
    };
  } catch (error) {
    console.error(
      `[clover] failed to resolve Stripe payment details for ${providerPaymentIntentId}`,
      error,
    );
    return null;
  }
}

async function failOrReschedule(job: ClaimedPrintJob, message: string): Promise<void> {
  console.error(`[clover] print job=${job.id} order=${job.orderId} failed: ${message}`);
  const attempts = job.attempts + 1;

  if (attempts >= job.maxAttempts) {
    await markPrintJobFailed(job.id, message);
    return;
  }

  await reschedulePrintJob(job.id, {
    attempts,
    nextAttemptAt: new Date(Date.now() + backoffMs(attempts)),
    error: message,
  });
}

function backoffMs(attempts: number): number {
  return Math.min(30 * 60 * 1000, 10_000 * 2 ** attempts);
}
