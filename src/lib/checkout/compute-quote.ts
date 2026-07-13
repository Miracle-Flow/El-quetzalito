import { formatInTimeZone } from "date-fns-tz";

import type {
  DailyAvailability,
  MenuItem,
  ModifierGroup,
  ModifierOption,
  Promotion,
  StoreSetting,
} from "@/payload-types.ts";

import { recomputePrice, type CatalogData } from "./price-recompute.ts";
import { applyPromotion } from "./promotion-engine.ts";
import {
  CheckoutInputSchema,
  QuoteResultSchema,
  type CheckoutInput,
  type QuoteResult,
} from "./schemas.ts";
import { generatePickupSlots } from "./slot-generation.ts";
import { computeTaxAndTip } from "./tax-tip.ts";

export interface ComputeQuoteContext {
  items: MenuItem[];
  options: ModifierOption[];
  availability: DailyAvailability[];
  promotions: Promotion[];
  settings: StoreSetting;
}

function buildItemOptionIds(items: MenuItem[]): Map<number, Set<number>> {
  const map = new Map<number, Set<number>>();

  for (const item of items) {
    const optionIds = new Set<number>();
    const groups = item.modifierGroups ?? [];

    for (const group of groups) {
      const resolvedGroup: ModifierGroup | null = typeof group === "number" ? null : group;

      if (!resolvedGroup) continue;

      for (const option of resolvedGroup.options ?? []) {
        const optionId = typeof option === "number" ? option : option.id;
        optionIds.add(optionId);
      }
    }

    map.set(item.id, optionIds);
  }

  return map;
}

export function buildCatalogData(context: ComputeQuoteContext): CatalogData {
  return {
    items: new Map(context.items.map((item) => [item.id, item])),
    options: new Map(context.options.map((option) => [option.id, option])),
    availability: new Map(
      context.availability.map((record) => [
        typeof record.menuItem === "number" ? record.menuItem : record.menuItem.id,
        record,
      ]),
    ),
    itemOptionIds: buildItemOptionIds(context.items),
  };
}

export function normalizeCheckoutInput(input: unknown): CheckoutInput {
  return CheckoutInputSchema.parse(input);
}

export function computeQuote(
  input: CheckoutInput,
  context: ComputeQuoteContext,
  now: Date = new Date(),
): QuoteResult {
  const parsed = normalizeCheckoutInput(input);
  const catalog = buildCatalogData(context);
  const { subtotalCents, lineErrors } = recomputePrice(catalog, parsed.cartLines);

  const promotionResult = applyPromotion({
    promotions: context.promotions,
    lines: parsed.cartLines,
    subtotalCents,
    userCode: parsed.promoCode,
    now,
  });

  const taxRate = context.settings.taxRate ?? 0.08875;
  const { taxCents, totalCents } = computeTaxAndTip({
    subtotalCents,
    discountCents: promotionResult.discountCents,
    tipCents: parsed.tipCents,
    taxRate,
  });

  const pickupSlots = generatePickupSlots({ settings: context.settings, now });

  const validationErrors: { lineItemId?: number; message: string }[] = lineErrors.flatMap((error) =>
    error.messages.map((message) => ({ lineItemId: error.lineItemId, message })),
  );

  if (parsed.pickupMode === "scheduled" && !parsed.pickupSlot) {
    validationErrors.push({
      lineItemId: undefined,
      message: "Please select a pickup time slot.",
    });
  }

  if (pickupSlots.length === 0) {
    validationErrors.push({
      lineItemId: undefined,
      message: "The store is currently closed. Please check back during business hours.",
    });
  }

  return QuoteResultSchema.parse({
    subtotalCents,
    discountCents: promotionResult.discountCents,
    taxCents,
    tipCents: parsed.tipCents,
    totalCents,
    appliedPromotion: promotionResult.appliedPromotion,
    pickupSlots,
    validationErrors,
  });
}

export function getDefaultTipPresets(settings?: StoreSetting): number[] {
  const configured = settings?.tipPresets?.map((preset) => preset.value);
  return configured && configured.length > 0 ? configured : [10, 15, 20];
}

export function getTodayDateInZone(timeZone: string): string {
  return formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");
}
