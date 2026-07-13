"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

import { Box } from "@/components/layout";

import { CartSummary } from "./cart-summary.tsx";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetTitle className="sr-only">Shopping cart</SheetTitle>
        <SheetDescription className="sr-only">
          Review the items in your cart and proceed to checkout.
        </SheetDescription>

        <Box className="flex-1 overflow-y-auto p-4">
          <CartSummary />
        </Box>
      </SheetContent>
    </Sheet>
  );
}
