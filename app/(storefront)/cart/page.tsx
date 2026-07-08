import Link from "next/link";

import { Button } from "@/components/ui/button";

import { CartIcon } from "@/components/icons.tsx";
import { Container, Section, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { CartSummary } from "@/src/components/cart/cart-summary.tsx";

export const metadata = {
  title: "Cart — El Quetzalito",
};

export default function CartPage() {
  return (
    <Section className="flex-1">
      <Container size="md">
        <Stack gap="8">
          <Stack gap="2" align="start">
            <Typography as="h1" variant="h3" weight="bold">
              Cart
            </Typography>
            <Typography variant="text-sm" textColor="muted">
              Review your order before checking out.
            </Typography>
          </Stack>

          <CartSummary />

          <Stack gap="4" align="center">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              render={
                <Link href="/">
                  <RenderIcon icon={CartIcon} size={16} />
                  Continue ordering
                </Link>
              }
            />
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
