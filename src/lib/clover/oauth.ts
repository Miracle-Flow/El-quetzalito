export interface CloverTokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

interface CloverTokenResponse {
  access_token: string;
  access_token_expiration: number;
  refresh_token: string;
  refresh_token_expiration: number;
}

export const STATE_COOKIE = "clover_oauth_state";

// Clover v2/OAuth contract: see docs.clover.com/dev/docs/generate-expiring-tokens-using-v2-oauth-flow
// and docs.clover.com/dev/docs/refresh-access-tokens. The host for /oauth/v2/authorize is the
// web host (sandbox.dev.clover.com / www.clover.com); /oauth/v2/token lives on the API host
// (apisandbox.dev.clover.com / api.clover.com). Expiration fields are Unix timestamps (seconds),
// not second-counts — there is no grant_type, expires_in, or token_type in this flow.

export function buildAuthorizeUrl(state: string): string {
  const authorizeUrl = process.env.CLOVER_OAUTH_AUTHORIZE_URL;
  const clientId = process.env.CLOVER_APP_ID;
  const redirectUri = process.env.CLOVER_OAUTH_REDIRECT_URI;

  if (!authorizeUrl || !clientId || !redirectUri) {
    throw new Error(
      "CLOVER_OAUTH_AUTHORIZE_URL, CLOVER_APP_ID, and CLOVER_OAUTH_REDIRECT_URI must be configured",
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  return `${authorizeUrl}?${params.toString()}`;
}

function parseTokenResponse(data: CloverTokenResponse): CloverTokenPair {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessTokenExpiresAt: new Date(data.access_token_expiration * 1000),
    refreshTokenExpiresAt: new Date(data.refresh_token_expiration * 1000),
  };
}

export async function exchangeAuthorizationCode(code: string): Promise<CloverTokenPair> {
  const apiBase = process.env.CLOVER_API_BASE_URL;
  const clientId = process.env.CLOVER_APP_ID;
  const clientSecret = process.env.CLOVER_APP_SECRET;

  if (!apiBase || !clientId || !clientSecret) {
    throw new Error("CLOVER_API_BASE_URL, CLOVER_APP_ID, and CLOVER_APP_SECRET must be configured");
  }

  const response = await fetch(`${apiBase}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Clover token exchange failed (${response.status}): ${detail}`);
  }

  return parseTokenResponse((await response.json()) as CloverTokenResponse);
}
