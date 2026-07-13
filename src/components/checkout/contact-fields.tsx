"use client";

import { useTranslation } from "@/lib/i18n";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EnvelopeIcon, PhoneIcon, UserIcon } from "@/components/icons.tsx";
import { Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

interface ContactFieldsProps {
  name: string;
  phone: string;
  email: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function ContactFields({
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
}: ContactFieldsProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="4" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        {t("checkout.contact.heading")}
      </Typography>

      <Stack gap="1" align="stretch">
        <Label htmlFor="checkout-name">
          <RenderIcon icon={UserIcon} size={14} />
          {t("checkout.contact.name")}
        </Label>
        <Input
          id="checkout-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={t("checkout.contact.name.placeholder")}
          required
        />
      </Stack>

      <Stack gap="1" align="stretch">
        <Label htmlFor="checkout-phone">
          <RenderIcon icon={PhoneIcon} size={14} />
          {t("checkout.contact.phone")}
        </Label>
        <Input
          id="checkout-phone"
          type="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="555-123-4567"
          required
        />
      </Stack>

      <Stack gap="1" align="stretch">
        <Label htmlFor="checkout-email">
          <RenderIcon icon={EnvelopeIcon} size={14} />
          {t("checkout.contact.email")}
        </Label>
        <Input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </Stack>
    </Stack>
  );
}
