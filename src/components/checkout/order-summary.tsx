"use client";

import { Box, Cluster, Stack } from "@/components/layout";
import { Typography } from "@/components/typography";

import { formatPrice } from "@/app/menu-helpers.ts";

import type { QuoteResult } from "@/src/lib/checkout/schemas.ts";
import type { CartLine } from "@/src/store/cart.ts";

interface OrderSummaryProps {
  lines: CartLine[];
  quote: QuoteResult | null;
  itemCount: number;
  hydrated: boolean;
}

export function OrderSummary({ lines, quote, itemCount, hydrated }: OrderSummaryProps) {
  const cartContent = (() => {
    if (!hydrated) {
      return (
        <Typography variant="text-sm" textColor="muted">
          Loading cart…
        </Typography>
      );
    }

    if (lines.length === 0) {
      return (
        <Typography variant="text-sm" textColor="muted">
          Your cart is empty.
        </Typography>
      );
    }

    return (
      <Stack gap="3" align="stretch">
        {lines.map((line) => (
          <Cluster key={line.lineId} align="start" justify="between" gap="3">
            <Stack gap="0.5" align="start">
              <Typography variant="text-sm" weight="medium">
                {line.quantity} × {line.itemSnapshot.name}
              </Typography>
              {line.modifiers.length > 0 && (
                <Typography variant="text-xs" textColor="muted">
                  {line.modifiers.map((modifier) => modifier.label).join(", ")}
                </Typography>
              )}
            </Stack>
            <Typography variant="text-sm" weight="semibold">
              {formatPrice(
                line.quantity *
                  (line.itemSnapshot.basePrice +
                    line.modifiers.reduce((sum, modifier) => sum + modifier.priceDelta, 0)),
              )}
            </Typography>
          </Cluster>
        ))}
      </Stack>
    );
  })();

  return (
    <Box bg="secondary" p="6" radius="lg">
      <Stack gap="4" align="stretch">
        <Typography as="h2" variant="h5" weight="semibold">
          Review order
        </Typography>

        {cartContent}

        <Box className="h-px bg-border" />

        <Stack gap="2" align="stretch">
          <Cluster align="center" justify="between" gap="3">
            <Typography variant="text-sm" textColor="muted">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </Typography>
            <Typography variant="text-sm">
              {quote ? formatPrice(quote.subtotalCents) : "—"}
            </Typography>
          </Cluster>

          <Cluster align="center" justify="between" gap="3">
            <Typography variant="text-sm" textColor="muted">
              Discount
            </Typography>
            <Typography variant="text-sm">
              {quote && quote.discountCents > 0 ? `-${formatPrice(quote.discountCents)}` : "—"}
            </Typography>
          </Cluster>

          <Cluster align="center" justify="between" gap="3">
            <Typography variant="text-sm" textColor="muted">
              Tax
            </Typography>
            <Typography variant="text-sm">{quote ? formatPrice(quote.taxCents) : "—"}</Typography>
          </Cluster>

          <Cluster align="center" justify="between" gap="3">
            <Typography variant="text-sm" textColor="muted">
              Tip
            </Typography>
            <Typography variant="text-sm">{quote ? formatPrice(quote.tipCents) : "—"}</Typography>
          </Cluster>

          <Box className="h-px bg-border" />

          <Cluster align="center" justify="between" gap="3">
            <Typography variant="text-lg" weight="bold">
              Total
            </Typography>
            <Typography variant="text-lg" weight="bold" textColor="primary">
              {quote ? formatPrice(quote.totalCents) : "—"}
            </Typography>
          </Cluster>
        </Stack>

        {quote && quote.validationErrors.length > 0 && (
          <Stack gap="1" align="stretch">
            {quote.validationErrors.map((error, index) => (
              <Typography key={index} variant="text-xs" textColor="destructive">
                {error.message}
              </Typography>
            ))}
          </Stack>
        )}

        {quote?.appliedPromotion && (
          <Typography variant="text-xs" textColor="muted">
            Promotion applied: {quote.appliedPromotion.name}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
