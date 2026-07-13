"use client";

import * as React from "react";

import { useTranslation } from "@/lib/i18n";

import { Label } from "@/components/ui/label";

import { CalendarIcon, ClockIcon } from "@/components/icons.tsx";
import { Box, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

interface PickupSlot {
  label: string;
  value: string;
}

interface PickupPickerProps {
  mode: "asap" | "scheduled";
  slot: string;
  slots: PickupSlot[];
  onModeChange: (mode: "asap" | "scheduled") => void;
  onSlotChange: (slot: string) => void;
}

export function PickupPicker({ mode, slot, slots, onModeChange, onSlotChange }: PickupPickerProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="4" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        {t("checkout.pickup.heading")}
      </Typography>

      <Box
        role="radiogroup"
        aria-label={t("checkout.pickup.heading")}
        className="grid grid-cols-2 gap-3"
      >
        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
            mode === "asap"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          <input
            type="radio"
            name="pickup-mode"
            value="asap"
            checked={mode === "asap"}
            onChange={() => onModeChange("asap")}
            className="sr-only"
          />
          <RenderIcon icon={ClockIcon} size={18} />
          <Stack gap="0" align="start">
            <Typography variant="text-sm" weight="semibold">
              {t("checkout.pickup.asap")}
            </Typography>
            <Typography variant="text-xs" textColor="muted">
              {t("checkout.pickup.asap.sub")}
            </Typography>
          </Stack>
        </label>

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
            mode === "scheduled"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border bg-background hover:bg-muted"
          }`}
        >
          <input
            type="radio"
            name="pickup-mode"
            value="scheduled"
            checked={mode === "scheduled"}
            onChange={() => onModeChange("scheduled")}
            className="sr-only"
          />
          <RenderIcon icon={CalendarIcon} size={18} />
          <Stack gap="0" align="start">
            <Typography variant="text-sm" weight="semibold">
              {t("checkout.pickup.scheduled")}
            </Typography>
            <Typography variant="text-xs" textColor="muted">
              {t("checkout.pickup.scheduled.sub")}
            </Typography>
          </Stack>
        </label>
      </Box>

      {mode === "scheduled" && (
        <Stack gap="1" align="stretch">
          <Label htmlFor="checkout-slot">
            <RenderIcon icon={ClockIcon} size={14} />
            {t("checkout.pickup.time")}
          </Label>
          <select
            id="checkout-slot"
            value={slot}
            onChange={(event) => onSlotChange(event.target.value)}
            required={mode === "scheduled"}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option value="" disabled>
              {t("checkout.pickup.select")}
            </option>
            {slots.map((pickupSlot) => (
              <option key={pickupSlot.value} value={pickupSlot.value}>
                {pickupSlot.label}
              </option>
            ))}
          </select>
          {slots.length === 0 && (
            <Typography variant="text-xs" textColor="muted">
              {t("checkout.pickup.none")}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
}
