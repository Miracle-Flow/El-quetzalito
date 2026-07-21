import { eq } from "drizzle-orm";

import { db } from "@/src/db/client";
import { cloverMerchants } from "@/src/db/schema";

const REFRESH_SKEW_MS = 60_000;

export type CloverMerchant = typeof cloverMerchants.$inferSelect;

export async function getValidAccessToken(merchant: CloverMerchant): Promise<string> {
  if (merchant.tokenExpiresAt.getTime() - REFRESH_SKEW_MS > Date.now()) {
    return merchant.accessToken;
  }

  return refreshAccessToken(merchant);
}

// Clover refresh contract: see docs.clover.com/dev/docs/refresh-access-tokens.
// The token URL and request shape differ by OAuth version (legacy /oauth/refresh vs
// OAuth 2.1 /oauth/v1/token). Verify the exact form against the merchant's app config
// in sandbox before relying on this in production.
async function refreshAccessToken(merchant: CloverMerchant): Promise<string> {
  const tokenUrl = process.env.CLOVER_TOKEN_URL;
  const clientId = process.env.CLOVER_APP_ID;
  const clientSecret = process.env.CLOVER_APP_SECRET;

  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error("CLOVER_TOKEN_URL, CLOVER_APP_ID, and CLOVER_APP_SECRET must be configured");
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: merchant.refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Clover token refresh failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const tokenExpiresAt = new Date(Date.now() + (data.expires_in ?? 3600) * 1000);

  await db
    .update(cloverMerchants)
    .set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? merchant.refreshToken,
      tokenExpiresAt,
      updatedAt: new Date(),
    })
    .where(eq(cloverMerchants.id, merchant.id));

  return data.access_token;
}
