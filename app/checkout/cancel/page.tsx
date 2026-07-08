import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

import { AlertTriangle, CheckIcon, Question } from "@/components/icons";
import { Container, Section, Stack, Cluster } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { loadOrderWithExpiry } from "@/app/actions/checkout.ts";

import { OrderDetails } from "@/src/components/checkout/order-details.tsx";

interface CancelPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolveOrderId(raw: string | string[] | undefined): number | null {
  if (typeof raw !== "string") return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export default async function CheckoutCancelPage({ searchParams }: CancelPageProps) {
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
                We couldn&apos;t find an order matching that reference.
              </Typography>
            </Stack>
            <Cluster gap="3">
              <Button variant="outline" render={<Link href="/cart">Return to cart</Link>} />
              <Button render={<Link href="/">Back to menu</Link>} />
            </Cluster>
          </Stack>
        </Container>
      </Section>
    );
  }

  const { order, lineItems, modifiers, paymentIntent } = result;

  if (order.status === "paid") {
    return (
      <Section className="flex-1" spacing="16">
        <Container size="md">
          <Stack gap="8" align="stretch">
            <Stack gap="4" align="center">
              <RenderIcon icon={CheckIcon} size={56} className="text-green-600" />
              <Stack gap="2" align="center">
                <Typography variant="h3" weight="bold" align="center">
                  Your order is paid
                </Typography>
                <Typography variant="text-md" textColor="muted" align="center">
                  It looks like your payment went through. No need to place it again.
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

  return (
    <Section className="flex-1" spacing="16">
      <Container size="md">
        <Stack gap="6" align="center">
          <RenderIcon icon={AlertTriangle} size={48} className="text-destructive" />
          <Stack gap="2" align="center">
            <Typography variant="h3" weight="bold" align="center">
              Checkout cancelled
            </Typography>
            <Typography variant="text-md" textColor="muted" align="center">
              Your order was not completed. You can return to your cart and try again, or contact us
              if you need help.
            </Typography>
          </Stack>
          <Cluster gap="3">
            <Button variant="outline" render={<Link href="/cart">Return to cart</Link>} />
            <Button render={<Link href="/">Back to menu</Link>} />
          </Cluster>
          <Button
            variant="ghost"
            render={
              <a href="mailto:hello@elquetzalito.com">
                <RenderIcon icon={Question} size={16} />
                Contact support
              </a>
            }
          />
        </Stack>
      </Container>
    </Section>
  );
}
