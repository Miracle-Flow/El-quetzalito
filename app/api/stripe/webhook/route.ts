import { headers } from "next/headers";

import type Stripe from "stripe";

import { db } from "@/src/db/client";
import { getStripe } from "@/src/lib/stripe";

import { processStripeWebhookEvent } from "./process";
import { createDrizzleWebhookStore } from "./store";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret is not configured", { status: 500 });
  }

  const body = await request.text();
  const requestHeaders = await headers();
  const signature = requestHeaders.get("stripe-signature") ?? "";

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  console.info(`[stripe webhook] received ${event.id} (${event.type}) -> webhook_events`);

  const result = await db.transaction(async (tx) => {
    const store = createDrizzleWebhookStore(tx);
    return processStripeWebhookEvent(event, store);
  });

  return new Response(result.message, { status: result.status });
}
