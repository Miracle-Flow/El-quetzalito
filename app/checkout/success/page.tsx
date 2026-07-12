import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlertTriangle, CheckIcon, ClockIcon } from "@/components/icons";
import { Container, Section, Stack, Cluster } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { loadOrderWithExpiry } from "@/app/actions/checkout.ts";

import { OrderDetails } from "@/src/components/checkout/order-details.tsx";

interface SuccessPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveOrderId(raw: string | string[] | undefined): number | null {
  if (typeof raw !== "string") return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderId = resolveOrderId(params.order_id);

  if (orderId === null) {
    notFound();
  }

  const result = await loadOrderWithExpiry(orderId);

  if (!result) {
    return (
      <Section className="flex-1" spacing="16">
        <Container size="md">
          <Stack gap="6" align="center">
            <RenderIcon icon={AlertTriangle} size={48} className="text-destructive" />
            <Stack gap="2" align="center">
              <Typography variant="h3" weight="bold" align="center">
                Order not found
              </Typography>
              <Typography variant="text-md" textColor="muted" align="center">
                We couldn&apos;t find an order matching that reference. It may have expired or the
                link might be incorrect.
              </Typography>
            </Stack>
            <Button variant="outline" asChild>
              <Link href="/">Back to menu</Link>
            </Button>
          </Stack>
        </Container>
      </Section>
    );
  }

  const { order, lineItems, modifiers, paymentIntent } = result;

  if (order.status === "cancelled") {
    return (
      <Section className="flex-1" spacing="16">
        <Container size="md">
          <Stack gap="6" align="center">
            <RenderIcon icon={AlertTriangle} size={48} className="text-destructive" />
            <Stack gap="2" align="center">
              <Typography variant="h3" weight="bold" align="center">
                Order cancelled
              </Typography>
              <Typography variant="text-md" textColor="muted" align="center">
                This order was cancelled, possibly because the checkout expired. You can return to
                your cart and try again.
              </Typography>
            </Stack>
            <Cluster gap="3">
              <Button variant="outline" asChild>
                <Link href="/cart">Return to cart</Link>
              </Button>
              <Button asChild>
                <Link href="/">Back to menu</Link>
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>
    );
  }

  if (order.status === "pending_payment") {
    return (
      <Section className="flex-1" spacing="16">
        <Container size="md">
          <Stack gap="6" align="center">
            <RenderIcon icon={ClockIcon} size={48} className="text-primary" />
            <Stack gap="2" align="center">
              <Typography variant="h3" weight="bold" align="center">
                We&apos;re confirming your payment
              </Typography>
              <Typography variant="text-md" textColor="muted" align="center">
                Your order is still being processed. Refresh the page in a moment, or continue to
                the menu while we finish up.
              </Typography>
            </Stack>
            <Cluster gap="3">
              <Button variant="outline" asChild>
                <a href={`/checkout/success?order_id=${orderId}`}>Refresh status</a>
              </Button>
              <Button asChild>
                <Link href="/">Continue to menu</Link>
              </Button>
            </Cluster>
          </Stack>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="flex-1" spacing="16">
      <Container size="md">
        <Stack gap="8" align="stretch">
          <Stack gap="4" align="center">
            <RenderIcon icon={CheckIcon} size={56} className="text-green-600" />
            <Stack gap="2" align="center">
              <Typography variant="h3" weight="bold" align="center">
                Thank you for your order
              </Typography>
              <Typography variant="text-md" textColor="muted" align="center">
                We&apos;ve received your order and will have it ready at the scheduled time.
              </Typography>
            </Stack>
          </Stack>

          <OrderDetails
            order={order}
            lineItems={lineItems}
            modifiers={modifiers}
            paymentIntent={paymentIntent}
          />
        </Stack>
      </Container>
    </Section>
  );
}
