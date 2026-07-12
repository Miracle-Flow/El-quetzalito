"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { CartIcon } from "@/components/icons.tsx";
import { Box, Cluster } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { selectHasHydrated, selectItemCount, useCartStore } from "@/src/store/cart.ts";

import { CartDrawer } from "./cart-drawer.tsx";

export type CartTriggerVariant = "fab" | "navbar";

export interface CartTriggerProps {
  /** `fab` = floating action button; `navbar` = compact control for the site header. */
  variant?: CartTriggerVariant;
  /** Navbar: match solid (scrolled) vs transparent (hero) chrome. */
  solid?: boolean;
  className?: string;
}

export function CartTrigger({ variant = "fab", solid = true, className }: CartTriggerProps) {
  const [open, setOpen] = React.useState(false);
  const itemCount = useCartStore(selectItemCount);
  const hydrated = useCartStore(selectHasHydrated);

  const navbarBadgeClass = solid
    ? "-top-1 -right-1 bg-navy text-white"
    : "-top-1 -right-1 bg-gold text-ink";
  const fabBadgeClass =
    "absolute -top-1.5 -right-1.5 border-2 border-background bg-primary text-primary-foreground";

  const badge =
    hydrated && itemCount > 0 ? (
      <Box
        as="span"
        className={cn(
          "absolute flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
          variant === "navbar" ? navbarBadgeClass : fabBadgeClass,
        )}
      >
        <Typography as="span" variant="text-xs" weight="semibold" textColor="inherit">
          {itemCount > 99 ? "99+" : itemCount}
        </Typography>
      </Box>
    ) : null;

  if (variant === "navbar") {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={hydrated && itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
            solid
              ? "bg-cream-deep text-ink hover:bg-gold hover:text-white"
              : "bg-white/15 text-cream hover:bg-white/25",
            className,
          )}
        >
          <RenderIcon icon={CartIcon} size={18} />
          {badge}
        </button>
        <CartDrawer open={open} onOpenChange={setOpen} />
      </>
    );
  }

  return (
    <>
      <Box className={cn("fixed right-6 bottom-6 z-40", className)}>
        <Button
          size="icon-lg"
          onClick={() => setOpen(true)}
          aria-label={hydrated && itemCount > 0 ? `Open cart, ${itemCount} items` : "Open cart"}
          className="relative shadow-lg"
        >
          <Cluster align="center" justify="center" gap="0">
            <RenderIcon icon={CartIcon} size={20} />
            {badge}
          </Cluster>
        </Button>
      </Box>

      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
