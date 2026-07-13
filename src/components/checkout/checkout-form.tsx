"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { Box, Stack } from "@/components/layout";
import { Typography } from "@/components/typography";

import { getQuote, submitCheckout } from "@/app/actions/checkout.ts";
import { formatPrice } from "@/app/menu-helpers.ts";

import type { CheckoutInput, QuoteResult } from "@/src/lib/checkout/schemas.ts";
import {
  selectHasHydrated,
  selectItemCount,
  selectSubtotal,
  useCartStore,
  type CartLine,
} from "@/src/store/cart.ts";

import { ContactFields } from "./contact-fields.tsx";
import { OrderSummary } from "./order-summary.tsx";
import { PickupPicker } from "./pickup-picker.tsx";
import { PromoField } from "./promo-field.tsx";
import { TipPicker } from "./tip-picker.tsx";

function cartLineToInput(line: CartLine): CheckoutInput["cartLines"][number] {
  return {
    itemId: line.itemSnapshot.id,
    name: line.itemSnapshot.name,
    basePriceCents: line.itemSnapshot.basePrice,
    categoryId: line.itemSnapshot.categoryId,
    quantity: line.quantity,
    modifiers: line.modifiers.map((modifier) => {
      const parts = modifier.id.split(":");
      const optionId = Number(parts.at(-1));

      return {
        optionId: Number.isFinite(optionId) && optionId > 0 ? optionId : 0,
        label: modifier.label,
        priceDeltaCents: modifier.priceDelta,
      };
    }),
    notes: line.notes,
  };
}

function useQuoteRequest() {
  const lines = useCartStore((state) => state.lines);
  const subtotal = useCartStore(selectSubtotal);
  const hydrated = useCartStore(selectHasHydrated);

  const [quote, setQuote] = React.useState<QuoteResult | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const requestQuote = React.useCallback(
    (partialInput: Omit<CheckoutInput, "name" | "phone" | "email" | "cartLines">) => {
      if (!hydrated || lines.length === 0) return;

      startTransition(async () => {
        try {
          setError(null);
          const result = await getQuote({
            ...partialInput,
            cartLines: lines.map(cartLineToInput),
          });

          if (result.success) {
            setQuote(result.quote);
          } else {
            setError(result.error);
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : "Unable to load quote.");
        }
      });
    },
    [hydrated, lines],
  );

  return { quote, pending, error, requestQuote, subtotal, lines };
}

export function CheckoutForm() {
  const itemCount = useCartStore(selectItemCount);
  const hydrated = useCartStore(selectHasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pickupMode, setPickupMode] = React.useState<"asap" | "scheduled">("asap");
  const [pickupSlot, setPickupSlot] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [appliedPromoCode, setAppliedPromoCode] = React.useState("");
  const [tipCents, setTipCents] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, startSubmit] = React.useTransition();

  const { quote, pending, error, requestQuote, subtotal, lines } = useQuoteRequest();

  React.useEffect(() => {
    requestQuote({
      pickupMode,
      pickupSlot: pickupSlot || undefined,
      promoCode: appliedPromoCode || undefined,
      tipCents,
    });
  }, [pickupMode, pickupSlot, appliedPromoCode, tipCents, requestQuote]);

  function handleApplyPromo(code: string) {
    setAppliedPromoCode(code.trim().toUpperCase());
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!quote || quote.validationErrors.length > 0) {
      setSubmitError("Please fix the errors before placing your order.");
      return;
    }

    startSubmit(async () => {
      try {
        const result = await submitCheckout({
          name,
          phone,
          email,
          pickupMode,
          pickupSlot: pickupSlot || undefined,
          promoCode: appliedPromoCode || undefined,
          tipCents,
          cartLines: lines.map(cartLineToInput),
        });

        if (result.success) {
          clearCart();
          window.location.href = result.checkoutUrl;
          return;
        }

        setSubmitError(result.error);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Checkout failed. Please try again.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="6" align="stretch">
        <Box bg="card" p="6" radius="lg" className="border border-border">
          <Stack gap="5" align="stretch">
            <ContactFields
              name={name}
              phone={phone}
              email={email}
              onNameChange={setName}
              onPhoneChange={setPhone}
              onEmailChange={setEmail}
            />

            <PickupPicker
              mode={pickupMode}
              slot={pickupSlot}
              slots={quote?.pickupSlots ?? []}
              onModeChange={setPickupMode}
              onSlotChange={setPickupSlot}
            />

            <PromoField
              code={promoCode}
              appliedCode={appliedPromoCode}
              onCodeChange={setPromoCode}
              onApply={handleApplyPromo}
            />

            <TipPicker subtotalCents={subtotal} tipCents={tipCents} onTipChange={setTipCents} />
          </Stack>
        </Box>

        <OrderSummary lines={lines} quote={quote} itemCount={itemCount} hydrated={hydrated} />

        {(error ?? submitError) && (
          <Typography variant="text-sm" textColor="destructive">
            {error ?? submitError}
          </Typography>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending || submitting || !hydrated || itemCount === 0}
          className="w-full"
        >
          {submitting
            ? `Placing order…`
            : `Place order ${quote ? formatPrice(quote.totalCents) : ""}`}
        </Button>
      </Stack>
    </form>
  );
}
