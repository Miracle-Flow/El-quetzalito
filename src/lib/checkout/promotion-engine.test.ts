import assert from "node:assert";
import { describe, it } from "node:test";

import type { Promotion } from "@/payload-types.ts";

import { applyPromotion, type PromotionEngineInput } from "./promotion-engine.ts";
import { CartLineSchema, type CartLine } from "./schemas.ts";

function makePromotion(overrides: Partial<Promotion> & { id: number }): Promotion {
  return {
    name: "Promo",
    applicationType: "auto",
    code: null,
    discountType: "percent",
    value: 10,
    scope: "order",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeCartLine(overrides: Partial<CartLine>): CartLine {
  return CartLineSchema.parse({
    itemId: 1,
    name: "Item",
    basePriceCents: 500,
    categoryId: 1,
    quantity: 1,
    modifiers: [],
    ...overrides,
  });
}

function run(
  input: Omit<PromotionEngineInput, "lines" | "now"> & {
    lines?: CartLine[];
    now?: Date | string;
  },
) {
  return applyPromotion({
    promotions: input.promotions,
    lines: input.lines ?? [makeCartLine({ basePriceCents: 1000 })],
    subtotalCents: input.subtotalCents,
    userCode: input.userCode,
    now:
      typeof input.now === "string"
        ? new Date(input.now)
        : (input.now ?? new Date("2026-07-06T12:00:00Z")),
  });
}

describe("applyPromotion", () => {
  it("applies an automatic percent promotion", () => {
    const promotion = makePromotion({ id: 1, discountType: "percent", value: 20 });

    const result = run({ promotions: [promotion], subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 200);
    assert.deepStrictEqual(result.appliedPromotion, {
      id: 1,
      name: "Promo",
      code: null,
    });
    assert.deepStrictEqual(result.reasons, []);
  });

  it("applies an automatic fixed promotion", () => {
    const promotion = makePromotion({ id: 2, discountType: "fixed", value: 300 });

    const result = run({ promotions: [promotion], subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 300);
    assert.strictEqual(result.appliedPromotion?.id, 2);
  });

  it("caps fixed discounts at the order subtotal", () => {
    const promotion = makePromotion({ id: 3, discountType: "fixed", value: 1500 });

    const result = run({ promotions: [promotion], subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 1000);
  });

  it("applies a code promotion only when the user provides a matching code", () => {
    const codePromotion = makePromotion({
      id: 4,
      applicationType: "code",
      code: "SUMMER",
      discountType: "percent",
      value: 25,
    });

    const withoutCode = run({ promotions: [codePromotion], subtotalCents: 1000 });
    assert.strictEqual(withoutCode.discountCents, 0);
    assert.strictEqual(withoutCode.appliedPromotion, null);
    assert.ok(withoutCode.reasons.some((reason) => reason.includes("No promotion available")));

    const withWrongCode = run({
      promotions: [codePromotion],
      subtotalCents: 1000,
      userCode: "WINTER",
    });
    assert.strictEqual(withWrongCode.discountCents, 0);
    assert.ok(
      withWrongCode.reasons.some((reason) =>
        reason.includes('No active promotion matched code "WINTER"'),
      ),
    );

    const withCode = run({
      promotions: [codePromotion],
      subtotalCents: 1000,
      userCode: "summer",
    });
    assert.strictEqual(withCode.discountCents, 250);
    assert.strictEqual(withCode.appliedPromotion?.id, 4);
  });

  it("only discounts lines within the scoped category", () => {
    const categoryPromotion = makePromotion({
      id: 5,
      discountType: "percent",
      value: 50,
      scope: "category",
      category: 2,
    });
    const lines = [
      makeCartLine({ itemId: 1, categoryId: 1, basePriceCents: 600, quantity: 1 }),
      makeCartLine({ itemId: 2, categoryId: 2, basePriceCents: 400, quantity: 1 }),
    ];

    const result = run({
      promotions: [categoryPromotion],
      lines,
      subtotalCents: 1000,
    });

    assert.strictEqual(result.discountCents, 200);
    assert.strictEqual(result.appliedPromotion?.id, 5);
  });

  it("does not stack promotions; prefers code when user supplies a matching code", () => {
    const autoPromotion = makePromotion({ id: 6, discountType: "percent", value: 30 });
    const codePromotion = makePromotion({
      id: 7,
      applicationType: "code",
      code: "BEST",
      discountType: "percent",
      value: 15,
    });

    const result = run({
      promotions: [autoPromotion, codePromotion],
      subtotalCents: 1000,
      userCode: "BEST",
    });

    assert.strictEqual(result.discountCents, 150);
    assert.strictEqual(result.appliedPromotion?.id, 7);
  });

  it("does not stack promotions; uses best auto promotion when no matching code", () => {
    const smallAuto = makePromotion({ id: 8, discountType: "percent", value: 10 });
    const bigAuto = makePromotion({ id: 9, discountType: "fixed", value: 500 });
    const codePromotion = makePromotion({
      id: 10,
      applicationType: "code",
      code: "UNUSED",
      discountType: "percent",
      value: 99,
    });

    const result = run({
      promotions: [smallAuto, bigAuto, codePromotion],
      subtotalCents: 1000,
    });

    assert.strictEqual(result.discountCents, 500);
    assert.strictEqual(result.appliedPromotion?.id, 9);
  });

  it("ignores promotions that require a minimum order value below the threshold", () => {
    const promotion = makePromotion({
      id: 11,
      discountType: "fixed",
      value: 200,
      minOrderValue: 1000,
    });

    const belowThreshold = run({ promotions: [promotion], subtotalCents: 999 });
    assert.strictEqual(belowThreshold.discountCents, 0);
    assert.ok(
      belowThreshold.reasons.some((reason) => reason.includes("requires a minimum order of 1000")),
    );

    const atThreshold = run({ promotions: [promotion], subtotalCents: 1000 });
    assert.strictEqual(atThreshold.discountCents, 200);
  });

  it("ignores inactive promotions", () => {
    const active = makePromotion({ id: 12, discountType: "percent", value: 20 });
    const inactive = makePromotion({ id: 13, discountType: "percent", value: 90, active: false });

    const result = run({ promotions: [active, inactive], subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 200);
    assert.strictEqual(result.appliedPromotion?.id, 12);
  });

  it("ignores promotions outside their validity window", () => {
    const futurePromotion = makePromotion({
      id: 14,
      discountType: "percent",
      value: 50,
      validFrom: "2026-08-01",
    });
    const expiredPromotion = makePromotion({
      id: 15,
      discountType: "percent",
      value: 50,
      validUntil: "2026-06-30",
    });

    const result = run({
      promotions: [futurePromotion, expiredPromotion],
      subtotalCents: 1000,
      now: "2026-07-06T12:00:00Z",
    });

    assert.strictEqual(result.discountCents, 0);
    assert.ok(result.reasons.some((reason) => reason.includes("not valid today")));
  });

  it("ignores category promotions when no cart line belongs to that category", () => {
    const categoryPromotion = makePromotion({
      id: 16,
      discountType: "percent",
      value: 50,
      scope: "category",
      category: 99,
    });

    const result = run({
      promotions: [categoryPromotion],
      subtotalCents: 1000,
    });

    assert.strictEqual(result.discountCents, 0);
    assert.ok(
      result.reasons.some((reason) => reason.includes("does not apply to items in your cart")),
    );
  });
});
