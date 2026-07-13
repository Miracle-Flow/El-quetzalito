import assert from "node:assert";
import { describe, it } from "node:test";

import type {
  DailyAvailability,
  MenuItem,
  ModifierGroup,
  ModifierOption,
  Promotion,
  StoreSetting,
} from "@/payload-types.ts";

import { buildCatalogData, computeQuote, getDefaultTipPresets } from "./compute-quote.ts";
import { CartLineSchema, type CartLine } from "./schemas.ts";

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

function makeContext(
  overrides: Partial<{
    items: MenuItem[];
    options: ModifierOption[];
    availability: DailyAvailability[];
    promotions: Promotion[];
    settings: Partial<StoreSetting>;
  }> = {},
): Parameters<typeof computeQuote>[1] {
  const baseSettings: StoreSetting = {
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
    taxRate: 0.08875,
  };

  return {
    items: [],
    options: [],
    availability: [],
    promotions: [],
    ...overrides,
    settings: { ...baseSettings, ...overrides.settings },
  };
}

describe("buildCatalogData", () => {
  it("maps item option ids from nested modifier groups", () => {
    const option = makeModifierOption({ id: 10, group: 1 });
    const group: ModifierGroup = {
      id: 1,
      label: "Extras",
      selectionType: "pickMany",
      pricingMode: "priced",
      options: [option],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const item = makeMenuItem({ id: 1, modifierGroups: [group] });

    const catalog = buildCatalogData(makeContext({ items: [item], options: [option] }));

    assert.deepStrictEqual(catalog.itemOptionIds.get(1), new Set([10]));
  });
});

describe("computeQuote", () => {
  it("computes a basic quote with tax and tip", () => {
    const item = makeMenuItem({ id: 1, basePrice: 1000 });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      promoCode: undefined,
      tipCents: 100,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 1000, quantity: 1 })],
    };

    const result = computeQuote(
      input,
      makeContext({ items: [item] }),
      new Date("2026-07-06T12:00:00Z"),
    );

    assert.strictEqual(result.subtotalCents, 1000);
    assert.strictEqual(result.taxCents, Math.round(1000 * 0.08875));
    assert.strictEqual(result.tipCents, 100);
    assert.strictEqual(result.totalCents, 1000 + result.taxCents + 100);
    assert.ok(result.pickupSlots.length > 0);
  });

  it("applies the best auto promotion", () => {
    const item = makeMenuItem({ id: 1, basePrice: 1000 });
    const promotion = makePromotion({ id: 1, discountType: "percent", value: 20 });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 1000 })],
    };

    const result = computeQuote(input, makeContext({ items: [item], promotions: [promotion] }));

    assert.strictEqual(result.discountCents, 200);
    assert.strictEqual(result.appliedPromotion?.id, 1);
    assert.strictEqual(result.totalCents, 800 + result.taxCents);
  });

  it("reports validation errors for sold-out items", () => {
    const item = makeMenuItem({ id: 1 });
    const availability = makeAvailability({ id: 1, menuItem: 1, status: "soldOut" });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(
      input,
      makeContext({ items: [item], availability: [availability] }),
    );

    assert.ok(result.validationErrors.some((error) => error.message.includes("sold out")));
  });

  it("flags missing pickup slot for scheduled mode", () => {
    const item = makeMenuItem({ id: 1 });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "scheduled" as const,
      pickupSlot: undefined,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(input, makeContext({ items: [item] }));

    assert.ok(result.validationErrors.some((error) => error.message.includes("pickup time slot")));
  });

  it("keeps provided pickup slot for scheduled mode", () => {
    const item = makeMenuItem({ id: 1 });
    const slotValue = "2026-07-06T18:00:00.000Z";
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "scheduled" as const,
      pickupSlot: slotValue,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(input, makeContext({ items: [item] }));

    assert.ok(!result.validationErrors.some((error) => error.message.includes("pickup time slot")));
  });

  it("returns empty slots when store is closed", () => {
    const item = makeMenuItem({ id: 1 });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(
      input,
      makeContext({
        items: [item],
        settings: {
          weeklyHours: [{ day: "Mon", open: "10:00", close: "14:00", closed: true }],
        },
      }),
      new Date("2026-07-06T12:00:00Z"),
    );

    assert.deepStrictEqual(result.pickupSlots, []);
  });

  it("reports validation error when store is closed", () => {
    const item = makeMenuItem({ id: 1 });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(
      input,
      makeContext({
        items: [item],
        settings: {
          weeklyHours: [{ day: "Mon", open: "10:00", close: "14:00", closed: true }],
        },
      }),
      new Date("2026-07-06T12:00:00Z"),
    );

    assert.ok(result.validationErrors.some((error) => error.message.includes("closed")));
  });

  it("reports validation error for sold-out items mid-checkout", () => {
    const item = makeMenuItem({ id: 1 });
    const availability = makeAvailability({ id: 1, menuItem: 1, status: "soldOut" });
    const input = {
      name: "Jane Doe",
      phone: "555-1234",
      email: "jane@example.com",
      pickupMode: "asap" as const,
      tipCents: 0,
      cartLines: [makeCartLine({ itemId: 1, basePriceCents: 500 })],
    };

    const result = computeQuote(
      input,
      makeContext({ items: [item], availability: [availability] }),
    );

    assert.ok(result.validationErrors.some((error) => error.message.includes("sold out")));
  });
});

describe("getDefaultTipPresets", () => {
  it("returns configured presets when available", () => {
    const settings: StoreSetting = {
      ...makeContext().settings,
      tipPresets: [{ value: 12 }, { value: 18 }],
    };

    assert.deepStrictEqual(getDefaultTipPresets(settings), [12, 18]);
  });

  it("falls back to 10/15/20 when no presets are configured", () => {
    assert.deepStrictEqual(getDefaultTipPresets(makeContext().settings), [10, 15, 20]);
  });
});
