import type { Promotion } from "@/payload-types.ts";

import type { CartLine } from "./schemas.ts";

export interface AppliedPromotion {
  id: number;
  name: string;
  code: string | null;
}

export interface PromotionEngineInput {
  promotions: Promotion[];
  lines: CartLine[];
  subtotalCents: number;
  userCode?: string;
  now?: Date;
}

export interface PromotionResult {
  discountCents: number;
  appliedPromotion: AppliedPromotion | null;
  reasons: string[];
}

function normalizeCode(code: string | null | undefined): string | undefined {
  return code?.trim().toUpperCase() ?? undefined;
}

function getCategoryId(category: number | { id: number } | null | undefined): number | null {
  if (category === null || category === undefined) return null;
  return typeof category === "number" ? category : category.id;
}

function getLineTotalCents(line: CartLine): number {
  const modifiersTotal = line.modifiers.reduce(
    (sum, modifier) => sum + modifier.priceDeltaCents,
    0,
  );
  return (line.basePriceCents + modifiersTotal) * line.quantity;
}

function isWithinValidity(promotion: Promotion, now: Date): boolean {
  const today = now.toISOString().slice(0, 10);

  if (promotion.validFrom && today < promotion.validFrom) {
    return false;
  }

  if (promotion.validUntil && today > promotion.validUntil) {
    return false;
  }

  return true;
}

function calculateScopeSubtotal(
  promotion: Promotion,
  lines: CartLine[],
  subtotalCents: number,
): number {
  if (promotion.scope === "category") {
    const categoryId = getCategoryId(promotion.category);
    if (!categoryId) return 0;

    return lines
      .filter((line) => line.categoryId === categoryId)
      .reduce((sum, line) => sum + getLineTotalCents(line), 0);
  }

  return subtotalCents;
}

function calculateDiscount(promotion: Promotion, lines: CartLine[], subtotalCents: number): number {
  const scopeSubtotal = calculateScopeSubtotal(promotion, lines, subtotalCents);

  if (scopeSubtotal <= 0) return 0;

  if (promotion.discountType === "percent") {
    return Math.round((scopeSubtotal * promotion.value) / 100);
  }

  return Math.min(promotion.value, scopeSubtotal);
}

function checkEligibility(
  promotion: Promotion,
  lines: CartLine[],
  subtotalCents: number,
  normalizedUserCode: string | undefined,
  now: Date,
): { eligible: true } | { eligible: false; reason: string } {
  if (!promotion.active) {
    return { eligible: false, reason: `${promotion.name} is inactive.` };
  }

  if (!isWithinValidity(promotion, now)) {
    return { eligible: false, reason: `${promotion.name} is not valid today.` };
  }

  if (promotion.minOrderValue && subtotalCents < promotion.minOrderValue) {
    return {
      eligible: false,
      reason: `${promotion.name} requires a minimum order of ${promotion.minOrderValue}.`,
    };
  }

  if (promotion.applicationType === "code") {
    if (!normalizedUserCode) {
      return { eligible: false, reason: `${promotion.name} requires a code.` };
    }
    if (normalizeCode(promotion.code) !== normalizedUserCode) {
      return {
        eligible: false,
        reason: `Code does not match ${promotion.name}.`,
      };
    }
  }

  if (promotion.scope === "category") {
    const categoryId = getCategoryId(promotion.category);
    if (!categoryId) {
      return {
        eligible: false,
        reason: `${promotion.name} does not apply to any category.`,
      };
    }

    const hasMatchingItem = lines.some((line) => line.categoryId === categoryId);
    if (!hasMatchingItem) {
      return {
        eligible: false,
        reason: `${promotion.name} does not apply to items in your cart.`,
      };
    }
  }

  return { eligible: true };
}

function toAppliedPromotion(promotion: Promotion): AppliedPromotion {
  return {
    id: promotion.id,
    name: promotion.name,
    code: promotion.code ?? null,
  };
}

export function applyPromotion({
  promotions,
  lines,
  subtotalCents,
  userCode,
  now = new Date(),
}: PromotionEngineInput): PromotionResult {
  const normalizedUserCode = normalizeCode(userCode);
  const reasons: string[] = [];

  if (normalizedUserCode) {
    const codePromotions = promotions.filter(
      (promotion) =>
        promotion.applicationType === "code" &&
        normalizeCode(promotion.code) === normalizedUserCode,
    );

    for (const promotion of codePromotions) {
      const result = checkEligibility(promotion, lines, subtotalCents, normalizedUserCode, now);

      if (result.eligible) {
        return {
          discountCents: calculateDiscount(promotion, lines, subtotalCents),
          appliedPromotion: toAppliedPromotion(promotion),
          reasons: [],
        };
      }

      reasons.push(result.reason);
    }

    reasons.push(`No active promotion matched code "${userCode}".`);
  }

  let best: { promotion: Promotion; discountCents: number } | null = null;

  for (const promotion of promotions) {
    if (promotion.applicationType !== "auto") continue;

    const result = checkEligibility(promotion, lines, subtotalCents, undefined, now);

    if (!result.eligible) {
      reasons.push(result.reason);
      continue;
    }

    const discountCents = calculateDiscount(promotion, lines, subtotalCents);

    if (discountCents > 0 && (!best || discountCents > best.discountCents)) {
      best = { promotion, discountCents };
    }
  }

  if (best) {
    return {
      discountCents: best.discountCents,
      appliedPromotion: toAppliedPromotion(best.promotion),
      reasons: [],
    };
  }

  return {
    discountCents: 0,
    appliedPromotion: null,
    reasons: reasons.length > 0 ? reasons : ["No promotion available."],
  };
}
