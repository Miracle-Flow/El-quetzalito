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

// Clover v2/OAuth refresh contract: POST /oauth/v2/refresh with { client_id, refresh_token }.
// No client_secret or grant_type is sent. The response returns access_token_expiration and
// refresh_token_expiration as Unix timestamps (seconds). Refresh tokens are single-use; the
// returned refresh_token replaces the old one immediately. See docs.clover.com/dev/docs/refresh-access-tokens.
async function refreshAccessToken(merchant: CloverMerchant): Promise<string> {
  const apiBase = process.env.CLOVER_API_BASE_URL;
  const clientId = process.env.CLOVER_APP_ID;

  if (!apiBase || !clientId) {
    throw new Error("CLOVER_API_BASE_URL and CLOVER_APP_ID must be configured");
  }

  const response = await fetch(`${apiBase}/oauth/v2/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      refresh_token: merchant.refreshToken,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Clover token refresh failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    access_token_expiration: number;
    refresh_token: string;
    refresh_token_expiration: number;
  };

  await db
    .update(cloverMerchants)
    .set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenExpiresAt: new Date(data.access_token_expiration * 1000),
      refreshTokenExpiresAt: new Date(data.refresh_token_expiration * 1000),
      updatedAt: new Date(),
    })
    .where(eq(cloverMerchants.id, merchant.id));

  return data.access_token;
}
