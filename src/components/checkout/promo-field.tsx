"use client";

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
  return (
    <Stack gap="3" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        Promo code
      </Typography>

      <Cluster align="center" gap="2" className="w-full">
        <Label htmlFor="checkout-promo" className="sr-only">
          Promo code
        </Label>
        <Input
          id="checkout-promo"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="Enter code"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={() => onApply(code)}>
          <RenderIcon icon={SparklesIcon} size={14} />
          Apply
        </Button>
      </Cluster>

      {appliedCode && (
        <Typography variant="text-xs" textColor="muted">
          Trying code: <span className="font-semibold uppercase">{appliedCode}</span>
        </Typography>
      )}
    </Stack>
  );
}
