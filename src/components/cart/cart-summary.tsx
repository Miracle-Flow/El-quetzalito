"use client";

import * as React from "react";

import Link from "next/link";

import { formatPrice } from "@/lib/menu-helpers.ts";

import { Button } from "@/components/ui/button";

import { CartIcon, MinusIcon, PlusIcon, Trash2Icon } from "@/components/icons.tsx";
import { Box, Cluster, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import {
  computeLineSubtotal,
  selectHasHydrated,
  selectItemCount,
  selectSubtotal,
  useCartStore,
} from "@/src/store/cart.ts";

export interface CartSummaryProps {
  checkoutHref?: string;
}

export function CartSummary({ checkoutHref = "/checkout" }: CartSummaryProps) {
  const lines = useCartStore((state) => state.lines);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectSubtotal);
  const itemCount = useCartStore(selectItemCount);
  const hydrated = useCartStore(selectHasHydrated);

  return (
    <Stack gap="6" align="stretch" className="h-full">
      <Cluster align="center" justify="between" gap="3">
        <Typography as="h2" variant="h5" weight="semibold">
          Your cart
        </Typography>
        {lines.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearCart}>
            Clear
          </Button>
        )}
      </Cluster>

      {(() => {
        if (!hydrated) {
          return (
            <Box py="12">
              <Typography variant="text-sm" textColor="muted" align="center">
                Loading cart…
              </Typography>
            </Box>
          );
        }

        if (lines.length === 0) {
          return (
            <Stack gap="6" align="center" className="py-12">
              <Box p="4" bg="secondary" className="rounded-full">
                <RenderIcon icon={CartIcon} size={32} className="text-muted-foreground" />
              </Box>
              <Stack gap="2" align="center">
                <Typography variant="text-lg" weight="semibold">
                  Your cart is empty
                </Typography>
                <Typography variant="text-sm" textColor="muted" align="center">
                  Add some delicious items from the menu to get started.
                </Typography>
              </Stack>
              <Button asChild>
                <Link href="/menu">Browse menu</Link>
              </Button>
            </Stack>
          );
        }

        return (
          <>
            <Stack gap="4" className="flex-1 overflow-y-auto">
              {lines.map((line) => {
                const lineSubtotal = computeLineSubtotal(line);

                return (
                  <Box
                    key={line.lineId}
                    bg="card"
                    p="4"
                    radius="lg"
                    className="border border-border"
                  >
                    <Stack gap="3" align="stretch">
                      <Cluster align="start" justify="between" gap="3">
                        <Stack gap="1" align="start" className="min-w-0">
                          <Typography
                            as="h3"
                            variant="text-md"
                            weight="semibold"
                            className="truncate"
                          >
                            {line.itemSnapshot.name}
                          </Typography>
                          {line.modifiers.length > 0 && (
                            <Typography variant="text-xs" textColor="muted">
                              {line.modifiers.map((modifier) => modifier.label).join(", ")}
                            </Typography>
                          )}
                        </Stack>
                        <Typography
                          as="span"
                          variant="text-sm"
                          weight="semibold"
                          textColor="primary"
                        >
                          {formatPrice(lineSubtotal)}
                        </Typography>
                      </Cluster>

                      <Cluster align="center" justify="between" gap="3">
                        <Cluster align="center" gap="2">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <RenderIcon icon={MinusIcon} size={14} />
                          </Button>
                          <Box px="3" py="1" bg="muted" radius="md">
                            <Typography variant="text-sm" weight="semibold">
                              {line.quantity}
                            </Typography>
                          </Box>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <RenderIcon icon={PlusIcon} size={14} />
                          </Button>
                        </Cluster>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeItem(line.lineId)}
                          aria-label={`Remove ${line.itemSnapshot.name}`}
                          className="text-destructive hover:text-destructive"
                        >
                          <RenderIcon icon={Trash2Icon} size={16} />
                        </Button>
                      </Cluster>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            <Stack gap="4" align="stretch">
              <Box p="4" bg="secondary" radius="lg">
                <Cluster align="center" justify="between" gap="3">
                  <Typography variant="text-sm" weight="medium" textColor="muted">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Typography>
                  <Typography variant="text-lg" weight="bold">
                    {formatPrice(subtotal)}
                  </Typography>
                </Cluster>
              </Box>

              <Button size="lg" className="w-full" asChild>
                <Link href={checkoutHref}>Proceed to checkout</Link>
              </Button>
            </Stack>
          </>
        );
      })()}
    </Stack>
  );
}
