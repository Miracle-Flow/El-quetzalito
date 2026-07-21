import { db } from "@/src/db/client";
import { cloverMerchants } from "@/src/db/schema";
import { STATE_COOKIE, exchangeAuthorizationCode } from "@/src/lib/clover/oauth";

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  const entry = header.split("; ").find((cookie) => cookie.startsWith(`${name}=`));
  return entry?.split("=").slice(1).join("=");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cloverMerchantId = url.searchParams.get("merchant_id");
  const state = url.searchParams.get("state");
  const cookieState = readCookie(request, STATE_COOKIE);

  if (!code || !cloverMerchantId) {
    return new Response("Missing code or merchant_id", { status: 400 });
  }

  if (!state || !cookieState || state !== cookieState) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  const tokens = await exchangeAuthorizationCode(code);

  const apiBaseUrl = process.env.CLOVER_API_BASE_URL;
  if (!apiBaseUrl) {
    return new Response("CLOVER_API_BASE_URL is not configured", { status: 500 });
  }

  await db
    .insert(cloverMerchants)
    .values({
      cloverMerchantId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
      apiBaseUrl,
    })
    .onConflictDoUpdate({
      target: cloverMerchants.cloverMerchantId,
      set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        updatedAt: new Date(),
      },
    });

  const returnUrl = process.env.CLOVER_OAUTH_RETURN_URL ?? "/";
  const redirectUrl = returnUrl.startsWith("http")
    ? returnUrl
    : new URL(returnUrl, url.origin).toString();

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      "Set-Cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; Secure; Max-Age=0`,
    },
  });
}
