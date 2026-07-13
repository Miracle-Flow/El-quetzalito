import { z } from "zod";

export const ModifierSelectionSchema = z.object({
  optionId: z.number().int().positive(),
  label: z.string().min(1),
  priceDeltaCents: z.number().int().min(0),
});

export const CartLineSchema = z.object({
  itemId: z.number().int().positive(),
  name: z.string().min(1),
  basePriceCents: z.number().int().min(0),
  categoryId: z.number().int().positive(),
  quantity: z.number().int().min(1),
  modifiers: z.array(ModifierSelectionSchema).default([]),
  notes: z.string().max(500).optional(),
});

export const CheckoutInputSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(1).max(30),
  email: z.string().email().max(120),
  pickupMode: z.enum(["asap", "scheduled"]),
  pickupSlot: z.string().datetime().optional(),
  promoCode: z.string().max(50).optional(),
  tipCents: z.number().int().min(0).default(0),
  cartLines: z.array(CartLineSchema).min(1),
});

export const AppliedPromotionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string().nullable(),
});

export const QuoteResultSchema = z.object({
  subtotalCents: z.number().int().min(0),
  discountCents: z.number().int().min(0),
  taxCents: z.number().int().min(0),
  tipCents: z.number().int().min(0),
  totalCents: z.number().int().min(0),
  appliedPromotion: AppliedPromotionSchema.nullable(),
  pickupSlots: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  validationErrors: z.array(
    z.object({
      lineItemId: z.number().int().optional(),
      message: z.string(),
    }),
  ),
});

export type ModifierSelection = z.infer<typeof ModifierSelectionSchema>;
export type CartLine = z.infer<typeof CartLineSchema>;
export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;
export type AppliedPromotion = z.infer<typeof AppliedPromotionSchema>;
export type QuoteResult = z.infer<typeof QuoteResultSchema>;
