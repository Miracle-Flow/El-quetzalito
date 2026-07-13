"use client";

import Link from "next/link";

import { useTranslation } from "@/lib/i18n";

import { Button } from "@/components/ui/button";

import { CartIcon } from "@/components/icons.tsx";
import { Container, Section, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { CartSummary } from "./cart-summary";

export function CartPageClient() {
  const { t } = useTranslation();

  return (
    <Section className="flex-1">
      <Container size="md">
        <Stack gap="8">
          <Stack gap="2" align="start">
            <Typography as="h1" variant="h3" weight="bold">
              {t("cart.title")}
            </Typography>
            <Typography variant="text-sm" textColor="muted">
              {t("cart.subtitle")}
            </Typography>
          </Stack>

          <CartSummary />

          <Stack gap="4" align="center">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/menu">
                <RenderIcon icon={CartIcon} size={16} />
                {t("cart.continue")}
              </Link>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
