import { randomUUID } from "node:crypto";

import { STATE_COOKIE, buildAuthorizeUrl } from "@/src/lib/clover/oauth";

export async function GET() {
  const state = randomUUID();
  const authorizeUrl = buildAuthorizeUrl(state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl,
      "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
