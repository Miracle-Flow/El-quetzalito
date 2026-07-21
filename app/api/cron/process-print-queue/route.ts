import { drainPrintQueue } from "@/src/lib/clover/print-queue";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function parseLimit(request: Request): number {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "25");
  return Number.isFinite(limit) && limit > 0 ? limit : 25;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const processed = await drainPrintQueue({ limit: parseLimit(request) });
  console.info(`[clover cron] processed ${processed} print job(s)`);
  return Response.json({ processed });
}

export async function POST(request: Request) {
  return GET(request);
}
