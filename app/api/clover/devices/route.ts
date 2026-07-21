import { db } from "@/src/db/client";
import { cloverDevices } from "@/src/db/schema";
import { getValidAccessToken } from "@/src/lib/clover/auth";
import { createHttpCloverClient } from "@/src/lib/clover/client";
import { getMerchant } from "@/src/lib/clover/repo";
import { syncDevicePrinters } from "@/src/lib/clover/setup";

interface RegisterDeviceInput {
  merchantId: number;
  serial: string;
  nickname?: string;
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RegisterDeviceInput | null;

  if (!body?.merchantId || !body.serial) {
    return Response.json({ error: "merchantId and serial are required" }, { status: 400 });
  }

  const merchant = await getMerchant(body.merchantId);
  if (!merchant) {
    return Response.json({ error: "Merchant not found" }, { status: 404 });
  }

  const [device] = await db
    .insert(cloverDevices)
    .values({
      merchantId: body.merchantId,
      serial: body.serial,
      nickname: body.nickname ?? null,
      isFiringDevice: true,
      status: "active",
    })
    .onConflictDoUpdate({
      target: cloverDevices.serial,
      set: {
        merchantId: body.merchantId,
        nickname: body.nickname ?? null,
        isFiringDevice: true,
        status: "active",
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();

  const client = createHttpCloverClient({
    baseUrl: merchant.apiBaseUrl,
    posId: process.env.CLOVER_POS_ID ?? "el-quetzalito",
    getAccessToken: () => getValidAccessToken(merchant),
  });

  await syncDevicePrinters(device.id, client, body.serial);

  return Response.json({ deviceId: device.id, serial: device.serial });
}
