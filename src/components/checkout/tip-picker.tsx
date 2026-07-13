"use client";

import * as React from "react";

import { useTranslation } from "@/lib/i18n";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { HeartIcon } from "@/components/icons.tsx";
import { Box, Cluster, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

const PRESETS = [10, 15, 20];

interface TipPickerProps {
  subtotalCents: number;
  tipCents: number;
  onTipChange: (cents: number) => void;
}

export function TipPicker({ subtotalCents, tipCents, onTipChange }: TipPickerProps) {
  const { t } = useTranslation();
  const [customPercent, setCustomPercent] = React.useState("");

  function applyPreset(percent: number) {
    const cents = Math.round((subtotalCents * percent) / 100);
    setCustomPercent("");
    onTipChange(cents);
  }

  function applyCustomPercent(value: string) {
    setCustomPercent(value);
    const percent = Number(value);
    if (Number.isFinite(percent) && percent >= 0) {
      onTipChange(Math.round((subtotalCents * percent) / 100));
    }
  }

  return (
    <Stack gap="3" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        {t("checkout.tip.heading")}
      </Typography>

      <Cluster align="center" gap="2" wrap>
        {PRESETS.map((percent) => (
          <Button
            key={percent}
            type="button"
            variant={
              tipCents === Math.round((subtotalCents * percent) / 100) ? "default" : "outline"
            }
            size="sm"
            onClick={() => applyPreset(percent)}
          >
            {percent}%
          </Button>
        ))}

        <Box className="flex flex-1 items-center gap-2">
          <Label htmlFor="checkout-custom-tip" className="sr-only">
            {t("checkout.tip.custom")}
          </Label>
          <Input
            id="checkout-custom-tip"
            type="number"
            min={0}
            value={customPercent}
            onChange={(event) => applyCustomPercent(event.target.value)}
            placeholder={t("checkout.tip.custom")}
            className="w-28"
          />
          <Typography variant="text-sm" textColor="muted">
            %
          </Typography>
        </Box>
      </Cluster>

      <Cluster align="center" gap="2">
        <RenderIcon icon={HeartIcon} size={14} />
        <Typography variant="text-sm" textColor="muted">
          {t("checkout.tip.amount")}
        </Typography>
        <Typography variant="text-sm" weight="semibold">
          ${(tipCents / 100).toFixed(2)}
        </Typography>
      </Cluster>
    </Stack>
  );
}
