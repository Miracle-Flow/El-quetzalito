"use client";

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
  return (
    <Stack gap="4" align="stretch">
      <Typography as="h2" variant="h5" weight="semibold">
        Contact
      </Typography>

      <Stack gap="1" align="stretch">
        <Label htmlFor="checkout-name">
          <RenderIcon icon={UserIcon} size={14} />
          Name
        </Label>
        <Input
          id="checkout-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Your name"
          required
        />
      </Stack>

      <Stack gap="1" align="stretch">
        <Label htmlFor="checkout-phone">
          <RenderIcon icon={PhoneIcon} size={14} />
          Phone
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
          Email
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
