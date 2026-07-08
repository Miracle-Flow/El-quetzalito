"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { CloseIcon } from "@/components/icons.tsx";
import { Box, Cluster } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";

import { CartSummary } from "./cart-summary.tsx";

export interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleClose() {
      onOpenChange(false);
    }

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-y-0 right-0 z-50 m-0 ml-auto h-full max-h-none w-full max-w-md overflow-y-auto border-l border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      aria-labelledby="cart-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <Box p="6" className="h-full">
        <Cluster align="center" justify="between" gap="3" className="mb-6">
          <span id="cart-title" className="sr-only">
            Shopping cart
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onOpenChange(false)}
            aria-label="Close cart"
            className="ml-auto"
          >
            <RenderIcon icon={CloseIcon} size={18} />
          </Button>
        </Cluster>

        <CartSummary />
      </Box>
    </dialog>
  );
}
