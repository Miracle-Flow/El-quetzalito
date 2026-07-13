"use client";

import { useTranslation } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SparklesIcon } from "@/components/icons.tsx";
import { Cluster, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

interface PromoFieldProps {
  code: string;
  appliedCode: string;
  onCodeChange: (value: string) => void;
  onApply: (code: string) => void;
}

export function PromoField({ code, appliedCode, onCodeChange, onApply }: PromoFieldProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="3" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        {t("checkout.promo.heading")}
      </Typography>

      <Cluster align="center" gap="2" className="w-full">
        <Label htmlFor="checkout-promo" className="sr-only">
          {t("checkout.promo.heading")}
        </Label>
        <Input
          id="checkout-promo"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder={t("checkout.promo.placeholder")}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={() => onApply(code)}>
          <RenderIcon icon={SparklesIcon} size={14} />
          {t("checkout.promo.apply")}
        </Button>
      </Cluster>

      {appliedCode && (
        <Typography variant="text-xs" textColor="muted">
          {t("checkout.promo.trying")}{" "}
          <span className="font-semibold uppercase">{appliedCode}</span>
        </Typography>
      )}
    </Stack>
  );
}
