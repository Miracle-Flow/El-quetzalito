"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Container, Section, Stack } from "@/components/layout";
import { Typography } from "@/components/typography";

import { CheckoutForm } from "@/src/components/checkout/checkout-form.tsx";
import { selectHasHydrated, selectItemCount, useCartStore } from "@/src/store/cart.ts";

export default function CheckoutPage() {
  const router = useRouter();
  const itemCount = useCartStore(selectItemCount);
  const hydrated = useCartStore(selectHasHydrated);

  React.useEffect(() => {
    if (hydrated && itemCount === 0) {
      router.replace("/cart");
    }
  }, [hydrated, itemCount, router]);

  return (
    <Section className="flex-1">
      <Container size="md">
        <Stack gap="8">
          <Stack gap="2" align="start">
            <Typography as="h1" variant="h3" weight="bold">
              Checkout
            </Typography>
            <Typography variant="text-sm" textColor="muted">
              Review your order, choose pickup, and place it with us.
            </Typography>
          </Stack>

          <CheckoutForm />
        </Stack>
      </Container>
    </Section>
  );
}
