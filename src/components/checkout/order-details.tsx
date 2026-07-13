import Link from "next/link";

import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";

import { Box, Cluster, Stack } from "@/components/layout";
import { Typography } from "@/components/typography";

import { formatPrice } from "@/app/menu-helpers.ts";

import type {
  orders,
  orderLineItems,
  orderLineItemModifiers,
  paymentIntents,
} from "@/src/db/schema";

type Order = typeof orders.$inferSelect;
type LineItem = typeof orderLineItems.$inferSelect;
type Modifier = typeof orderLineItemModifiers.$inferSelect;
type PaymentIntent = typeof paymentIntents.$inferSelect;

interface OrderDetailsProps {
  order: Order;
  lineItems: LineItem[];
  modifiers: Modifier[];
  paymentIntent: PaymentIntent | null;
}

function formatPickupSlot(date: Date | null): string {
  if (!date) return "";

  return formatInTimeZone(date, "America/Guatemala", "MMMM d, yyyy 'at' h:mm a");
}

function getModifiersForLineItem(modifiers: Modifier[], lineItemId: number): Modifier[] {
  return modifiers.filter((modifier) => modifier.orderLineId === lineItemId);
}

export function OrderDetails({ order, lineItems, modifiers }: OrderDetailsProps) {
  const hasDiscount = order.discountCents > 0;
  const hasTax = order.taxCents > 0;
  const hasTip = order.tipCents > 0;

  return (
    <Stack gap="8" align="stretch">
      <Box bg="card" p="6" radius="xl">
        <Stack gap="4" align="stretch">
          <Cluster justify="between" align="start">
            <Stack gap="1" align="start">
              <Typography variant="text-sm" textColor="muted">
                Order number
              </Typography>
              <Typography variant="h5" weight="bold">
                {order.orderNumber ?? `#${order.id}`}
              </Typography>
            </Stack>
            <Typography
              variant="text-sm"
              weight="semibold"
              className="rounded-full bg-primary/10 px-3 py-1 text-primary capitalize"
            >
              {order.status.replaceAll("_", " ")}
            </Typography>
          </Cluster>

          <Stack gap="1" align="start">
            <Typography variant="text-sm" textColor="muted">
              Pickup
            </Typography>
            <Typography variant="text-md" weight="medium">
              {order.pickupMode.replaceAll("_", " ")}
            </Typography>
            {order.pickupSlot && (
              <Typography variant="text-sm" textColor="muted">
                {formatPickupSlot(order.pickupSlot)}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>

      <Stack gap="4" align="stretch">
        <Typography variant="h6" weight="semibold">
          Order summary
        </Typography>

        <Box bg="card" p="6" radius="xl">
          <Stack gap="4" align="stretch">
            {lineItems.map((line) => {
              const lineModifiers = getModifiersForLineItem(modifiers, line.id);

              return (
                <Stack key={line.id} gap="1" align="stretch">
                  <Cluster justify="between" align="start">
                    <Typography variant="text-md" weight="medium">
                      {line.quantity}× {line.name}
                    </Typography>
                    <Typography variant="text-md" weight="semibold">
                      {formatPrice(line.lineTotalCents)}
                    </Typography>
                  </Cluster>

                  {lineModifiers.length > 0 && (
                    <Stack gap="0.5" align="start" className="pl-4">
                      {lineModifiers.map((modifier) => (
                        <Typography key={modifier.id} variant="text-sm" textColor="muted">
                          + {modifier.label}
                          {modifier.priceDeltaCents > 0
                            ? ` (${formatPrice(modifier.priceDeltaCents)})`
                            : ""}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </Stack>
              );
            })}

            <div className="border-t border-border" />

            <Cluster justify="between">
              <Typography variant="text-md" textColor="muted">
                Subtotal
              </Typography>
              <Typography variant="text-md">{formatPrice(order.subtotalCents)}</Typography>
            </Cluster>

            {hasDiscount && (
              <Cluster justify="between">
                <Typography variant="text-md" textColor="muted">
                  Discount
                </Typography>
                <Typography variant="text-md" className="text-green-600">
                  -{formatPrice(order.discountCents)}
                </Typography>
              </Cluster>
            )}

            {hasTax && (
              <Cluster justify="between">
                <Typography variant="text-md" textColor="muted">
                  Tax
                </Typography>
                <Typography variant="text-md">{formatPrice(order.taxCents)}</Typography>
              </Cluster>
            )}

            {hasTip && (
              <Cluster justify="between">
                <Typography variant="text-md" textColor="muted">
                  Tip
                </Typography>
                <Typography variant="text-md">{formatPrice(order.tipCents)}</Typography>
              </Cluster>
            )}

            <div className="border-t border-border" />

            <Cluster justify="between">
              <Typography variant="text-lg" weight="bold">
                Total
              </Typography>
              <Typography variant="text-lg" weight="bold">
                {formatPrice(order.totalCents)}
              </Typography>
            </Cluster>
          </Stack>
        </Box>
      </Stack>

      <Button variant="outline" className="w-full sm:w-auto" asChild>
        <Link href="/">Back to menu</Link>
      </Button>
    </Stack>
  );
}
