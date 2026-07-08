import assert from "node:assert";
import { describe, it } from "node:test";

import type {
  DailyAvailability,
  MenuItem,
  ModifierOption,
  Promotion,
  StoreSetting,
} from "@/payload-types.ts";

import { recomputePrice, type CatalogData } from "./price-recompute.ts";
import { applyPromotion } from "./promotion-engine.ts";
import { CartLineSchema, type CartLine } from "./schemas.ts";
import { generatePickupSlots } from "./slot-generation.ts";
import { computeTaxAndTip } from "./tax-tip.ts";

function makeMenuItem(overrides: Partial<MenuItem> & { id: number }): MenuItem {
  return {
    name: "Item",
    slug: `item-${overrides.id}`,
    basePrice: 500,
    category: 1,
    availabilityType: "madeToOrder",
    active: true,
    sortOrder: 0,
    modifierGroups: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeModifierOption(overrides: Partial<ModifierOption> & { id: number }): ModifierOption {
  return {
    label: "Option",
    priceDelta: 100,
    group: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeAvailability(
  overrides: Partial<DailyAvailability> & { id: number; menuItem: number },
): DailyAvailability {
  return {
    date: new Date().toISOString().slice(0, 10),
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

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

function buildCatalog(
  items: MenuItem[],
  options: ModifierOption[],
  availability: DailyAvailability[],
  itemOptionIds?: Map<number, Set<number>>,
): CatalogData {
  return {
    items: new Map(items.map((item) => [item.id, item])),
    options: new Map(options.map((option) => [option.id, option])),
    availability: new Map(
      availability.map((record) => [
        typeof record.menuItem === "number" ? record.menuItem : record.menuItem.id,
        record,
      ]),
    ),
    itemOptionIds: itemOptionIds ?? new Map(),
  };
}

describe("price-recompute", () => {
  it("computes subtotal without modifiers", () => {
    const item = makeMenuItem({ id: 1, basePrice: 500 });
    const catalog = buildCatalog([item], [], []);
    const lines = [makeCartLine({ itemId: 1, basePriceCents: 500, quantity: 3 })];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.subtotalCents, 1500);
    assert.deepStrictEqual(result.lineErrors, []);
  });

  it("computes subtotal with modifiers", () => {
    const item = makeMenuItem({ id: 1, basePrice: 500 });
    const option = makeModifierOption({ id: 10, priceDelta: 150 });
    const catalog = buildCatalog([item], [option], [], new Map([[1, new Set([10])]]));
    const lines = [
      makeCartLine({
        itemId: 1,
        basePriceCents: 500,
        quantity: 2,
        modifiers: [{ optionId: 10, label: "Extra", priceDeltaCents: 150 }],
      }),
    ];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.subtotalCents, 1300);
    assert.deepStrictEqual(result.lineErrors, []);
  });

  it("reports missing item", () => {
    const catalog = buildCatalog([], [], []);
    const lines = [makeCartLine({ itemId: 99, name: "Missing", basePriceCents: 300 })];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.subtotalCents, 300);
    assert.strictEqual(result.lineErrors.length, 1);
    assert.ok(result.lineErrors[0].messages.some((m) => m.includes("no longer available")));
  });

  it("reports inactive item", () => {
    const item = makeMenuItem({ id: 1, active: false });
    const catalog = buildCatalog([item], [], []);
    const lines = [makeCartLine({ itemId: 1, basePriceCents: 500 })];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.lineErrors.length, 1);
    assert.ok(result.lineErrors[0].messages.some((m) => m.includes("unavailable")));
  });

  it("reports sold-out item", () => {
    const item = makeMenuItem({ id: 1 });
    const availability = makeAvailability({ id: 1, menuItem: 1, status: "soldOut" });
    const catalog = buildCatalog([item], [], [availability]);
    const lines = [makeCartLine({ itemId: 1, basePriceCents: 500 })];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.lineErrors.length, 1);
    assert.ok(result.lineErrors[0].messages.some((m) => m.includes("sold out")));
  });

  it("reports price mismatch", () => {
    const item = makeMenuItem({ id: 1, basePrice: 600 });
    const catalog = buildCatalog([item], [], []);
    const lines = [makeCartLine({ itemId: 1, basePriceCents: 500 })];

    const result = recomputePrice(catalog, lines);

    assert.strictEqual(result.subtotalCents, 600);
    assert.ok(result.lineErrors[0].messages.some((m) => m.includes("Price")));
  });

  it("reports invalid modifier option for item", () => {
    const item = makeMenuItem({ id: 1 });
    const option = makeModifierOption({ id: 10 });
    const catalog = buildCatalog([item], [option], [], new Map([[1, new Set<number>()]]));
    const lines = [
      makeCartLine({
        itemId: 1,
        modifiers: [{ optionId: 10, label: "Extra", priceDeltaCents: 100 }],
      }),
    ];

    const result = recomputePrice(catalog, lines);

    assert.ok(result.lineErrors[0].messages.some((m) => m.includes("not valid")));
  });
});

describe("promotion-engine", () => {
  const lines = [makeCartLine({ itemId: 1, basePriceCents: 1000, quantity: 1, categoryId: 1 })];

  it("applies percent order discount", () => {
    const promotion = makePromotion({ id: 1, discountType: "percent", value: 10 });
    const result = applyPromotion({ promotions: [promotion], lines, subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 100);
    assert.strictEqual(result.appliedPromotion?.name, "Promo");
  });

  it("applies fixed order discount capped at subtotal", () => {
    const promotion = makePromotion({ id: 1, discountType: "fixed", value: 3000 });
    const result = applyPromotion({ promotions: [promotion], lines, subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 1000);
  });

  it("applies category-scoped discount only to matching items", () => {
    const cartLines = [
      makeCartLine({ itemId: 1, basePriceCents: 1000, quantity: 1, categoryId: 1 }),
      makeCartLine({ itemId: 2, basePriceCents: 500, quantity: 1, categoryId: 2 }),
    ];
    const promotion = makePromotion({
      id: 1,
      discountType: "percent",
      value: 50,
      scope: "category",
      category: 1,
    });
    const result = applyPromotion({
      promotions: [promotion],
      lines: cartLines,
      subtotalCents: 1500,
    });

    assert.strictEqual(result.discountCents, 500);
  });

  it("rejects promotion below minimum order value", () => {
    const promotion = makePromotion({
      id: 1,
      discountType: "fixed",
      value: 100,
      minOrderValue: 2000,
    });
    const result = applyPromotion({ promotions: [promotion], lines, subtotalCents: 1000 });

    assert.strictEqual(result.discountCents, 0);
    assert.strictEqual(result.appliedPromotion, null);
    assert.ok(result.reasons.some((r) => r.includes("minimum")));
  });

  it("rejects expired promotion", () => {
    const promotion = makePromotion({
      id: 1,
      validFrom: "2020-01-01",
      validUntil: "2020-01-02",
    });
    const result = applyPromotion({
      promotions: [promotion],
      lines,
      subtotalCents: 1000,
      now: new Date("2025-06-01T12:00:00Z"),
    });

    assert.strictEqual(result.discountCents, 0);
    assert.ok(result.reasons.some((r) => r.includes("not valid")));
  });

  it("applies code promotion when code matches", () => {
    const promotion = makePromotion({
      id: 1,
      applicationType: "code",
      code: "SAVE20",
      discountType: "percent",
      value: 20,
    });
    const result = applyPromotion({
      promotions: [promotion],
      lines,
      subtotalCents: 1000,
      userCode: "save20",
    });

    assert.strictEqual(result.discountCents, 200);
    assert.strictEqual(result.appliedPromotion?.code, "SAVE20");
  });

  it("prefers user code over auto promotion", () => {
    const auto = makePromotion({ id: 1, discountType: "percent", value: 50 });
    const code = makePromotion({
      id: 2,
      applicationType: "code",
      code: "SMALL",
      discountType: "percent",
      value: 10,
    });
    const result = applyPromotion({
      promotions: [auto, code],
      lines,
      subtotalCents: 1000,
      userCode: "SMALL",
    });

    assert.strictEqual(result.discountCents, 100);
    assert.strictEqual(result.appliedPromotion?.id, 2);
  });

  it("chooses best auto promotion", () => {
    const small = makePromotion({ id: 1, discountType: "percent", value: 10 });
    const large = makePromotion({ id: 2, discountType: "percent", value: 25 });
    const result = applyPromotion({
      promotions: [small, large],
      lines,
      subtotalCents: 1000,
    });

    assert.strictEqual(result.discountCents, 250);
    assert.strictEqual(result.appliedPromotion?.id, 2);
  });
});

describe("tax-tip", () => {
  it("computes tax on discounted subtotal and adds tip", () => {
    const result = computeTaxAndTip({
      subtotalCents: 1000,
      discountCents: 100,
      tipCents: 200,
      taxRate: 0.08875,
    });

    assert.strictEqual(result.taxableCents, 900);
    assert.strictEqual(result.taxCents, Math.round(900 * 0.08875));
    assert.strictEqual(result.totalCents, result.taxableCents + result.taxCents + 200);
  });

  it("rounds tax to nearest cent", () => {
    const result = computeTaxAndTip({
      subtotalCents: 1234,
      discountCents: 0,
      tipCents: 0,
      taxRate: 0.08875,
    });

    assert.strictEqual(result.taxCents, Math.round(1234 * 0.08875));
  });

  it("does not let discount create negative taxable amount", () => {
    const result = computeTaxAndTip({
      subtotalCents: 500,
      discountCents: 1000,
      tipCents: 0,
      taxRate: 0.1,
    });

    assert.strictEqual(result.taxableCents, 0);
    assert.strictEqual(result.taxCents, 0);
  });
});

describe("slot-generation", () => {
  const baseSettings = {
    id: 1,
    storeName: "El Quetzalito",
    isOpen: true,
    timezone: "America/Guatemala",
    leadTimeMinutes: 20,
    slotIntervalMinutes: 15,
    weeklyHours: [
      { day: "Mon", open: "10:00", close: "14:00", closed: false },
      { day: "Tue", open: "10:00", close: "14:00", closed: false },
      { day: "Wed", open: "10:00", close: "14:00", closed: false },
      { day: "Thu", open: "10:00", close: "14:00", closed: false },
      { day: "Fri", open: "10:00", close: "14:00", closed: false },
      { day: "Sat", open: "10:00", close: "14:00", closed: false },
      { day: "Sun", open: "10:00", close: "14:00", closed: false },
    ],
    dailyOverrides: [],
    tipPresets: [],
  } satisfies StoreSetting;

  it("returns no slots when weekly hours mark day closed", () => {
    const settings: StoreSetting = {
      ...baseSettings,
      weeklyHours: [{ day: "Mon", open: "10:00", close: "14:00", closed: true }],
    };
    const result = generatePickupSlots({
      settings,
      now: new Date("2026-07-06T12:00:00-06:00"),
    });

    assert.deepStrictEqual(result, []);
  });

  it("returns no slots when daily override closes the store", () => {
    const settings: StoreSetting = {
      ...baseSettings,
      dailyOverrides: [{ date: "2026-07-06", closed: true }],
    };
    const result = generatePickupSlots({
      settings,
      now: new Date("2026-07-06T12:00:00-06:00"),
    });

    assert.deepStrictEqual(result, []);
  });

  it("respects lead time by excluding past slots", () => {
    const result = generatePickupSlots({
      settings: baseSettings,
      now: new Date("2026-07-06T10:05:00-06:00"),
    });

    const firstSlotValue = result[0]?.value;
    assert.ok(firstSlotValue);
    const firstSlot = new Date(firstSlotValue);
    assert.ok(
      firstSlot.getTime() >= new Date("2026-07-06T10:25:00-06:00").getTime(),
      `first slot ${firstSlot.toISOString()} is before cutoff`,
    );
  });

  it("generates slots at configured intervals", () => {
    const result = generatePickupSlots({
      settings: baseSettings,
      now: new Date("2026-07-06T09:00:00-06:00"),
    });

    assert.ok(result.length > 0);
    for (const slot of result) {
      // oxlint-disable-next-line prefer-named-capture-group
      assert.match(slot.label, /\d{1,2}:\d{2} (AM|PM)/);
      assert.ok(slot.value);
    }
  });

  it("uses override hours when provided", () => {
    const settings: StoreSetting = {
      ...baseSettings,
      dailyOverrides: [{ date: "2026-07-06", closed: false, open: "12:00", close: "13:00" }],
    };
    const result = generatePickupSlots({
      settings,
      now: new Date("2026-07-06T09:00:00-06:00"),
    });

    const first = new Date(result[0].value);
    const last = new Date(result.at(-1)!.value);
    assert.strictEqual(first.toISOString(), new Date("2026-07-06T12:00:00-06:00").toISOString());
    assert.strictEqual(last.toISOString(), new Date("2026-07-06T13:00:00-06:00").toISOString());
  });
});
