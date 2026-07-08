"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { CartIcon } from "@/components/icons.tsx";
import { Box, Cluster } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { selectHasHydrated, selectItemCount, useCartStore } from "@/src/store/cart.ts";

import { CartDrawer } from "./cart-drawer.tsx";

export function CartTrigger() {
  const [open, setOpen] = React.useState(false);
  const itemCount = useCartStore(selectItemCount);
  const hydrated = useCartStore(selectHasHydrated);

  return (
    <>
      <Box className="fixed right-6 bottom-6 z-40">
        <Button
          size="icon-lg"
          onClick={() => setOpen(true)}
          aria-label="Open cart"
          className="shadow-lg"
        >
          <Cluster align="center" justify="center" gap="0">
            <RenderIcon icon={CartIcon} size={20} />
            {hydrated && itemCount > 0 && (
              <Box
                as="span"
                bg="primary"
                className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              >
                <Typography as="span" variant="text-xs" weight="semibold" textColor="inherit">
                  {itemCount > 99 ? "99+" : itemCount}
                </Typography>
              </Box>
            )}
          </Cluster>
        </Button>
      </Box>

      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
