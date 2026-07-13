import Stripe from "stripe";

const apiVersion = "2026-06-24.dahlia";

let stripeClient: Stripe | null = null;

function getSecretKey(): string {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }

  if (!secretKey.startsWith("sk_test_")) {
    console.warn(
      "[stripe] STRIPE_SECRET_KEY is not a test-mode key. Verify you are using the correct environment.",
    );
  }

  return secretKey;
}

export function getStripe(): Stripe {
  stripeClient ??= new Stripe(getSecretKey(), {
    apiVersion,
  });

  return stripeClient;
}

export async function createCheckoutSession({
  amount,
  currency,
  orderId,
  orderNumber,
  customerEmail,
}: {
  amount: number;
  currency: string;
  orderId: number;
  orderNumber: string;
  customerEmail: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60;

  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: `El Quetzalito order ${orderNumber}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: orderId.toString(),
      orderNumber,
      customerEmail,
    },
    success_url: `${baseUrl}/checkout/success?order_id=${orderId}`,
    cancel_url: `${baseUrl}/checkout/cancel?order_id=${orderId}`,
    expires_at: expiresAt,
  });

  return session;
}
