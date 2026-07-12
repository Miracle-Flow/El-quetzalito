import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSoldOutSet,
  formatPrice,
  formatToday,
  getCategoryId,
  getCategoryName,
  groupItemsByCategory,
  isItemAddDisabled,
} from "../lib/menu-helpers.ts";
import type { Category, DailyAvailability, MenuItem } from "../payload-types.ts";

function makeCategory(id: number, name: string): Category {
  return {
    id,
    name,
    slug: name.toLowerCase().replaceAll(/\s+/g, "-"),
    description: null,
    menu: null,
    sortOrder: id,
    active: true,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function makeMenuItem(
  id: number,
  name: string,
  category: number | Category,
  basePrice: number,
  availabilityType: MenuItem["availabilityType"] = "madeToOrder",
): MenuItem {
  return {
    id,
    name,
    slug: name.toLowerCase().replaceAll(/\s+/g, "-"),
    description: `${name} description`,
    basePrice,
    category,
    availabilityType,
    active: true,
    image: null,
    modifierGroups: null,
    sortOrder: id,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("formatPrice", () => {
  it("formats zero cents as $0.00", () => {
    assert.equal(formatPrice(0), "$0.00");
  });

  it("formats dollars without cents", () => {
    assert.equal(formatPrice(900), "$9.00");
  });

  it("formats dollars with cents", () => {
    assert.equal(formatPrice(995), "$9.95");
  });

  it("rounds to two decimal places", () => {
    assert.equal(formatPrice(999), "$9.99");
  });
});

describe("getCategoryId", () => {
  it("returns the id when category is a number", () => {
    assert.equal(getCategoryId(42), 42);
  });

  it("returns the id when category is an object", () => {
    assert.equal(getCategoryId(makeCategory(7, "Mains")), 7);
  });
});

describe("getCategoryName", () => {
  it("returns the fallback when category is a number", () => {
    assert.equal(getCategoryName(42), "Menu");
  });

  it("uses a custom fallback", () => {
    assert.equal(getCategoryName(42, "Uncategorized"), "Uncategorized");
  });

  it("returns the category name when category is an object", () => {
    assert.equal(getCategoryName(makeCategory(7, "Mains")), "Mains");
  });
});

describe("buildSoldOutSet", () => {
  it("builds an empty set from no records", () => {
    assert.equal(buildSoldOutSet([]).size, 0);
  });

  it("collects numeric menu item ids", () => {
    const records: DailyAvailability[] = [
      {
        id: 1,
        date: "2026-07-08",
        menuItem: 10,
        status: "soldOut",
        updatedAt: "",
        createdAt: "",
      },
      {
        id: 2,
        date: "2026-07-08",
        menuItem: 20,
        status: "soldOut",
        updatedAt: "",
        createdAt: "",
      },
    ];

    const set = buildSoldOutSet(records);
    assert.equal(set.size, 2);
    assert.ok(set.has(10));
    assert.ok(set.has(20));
  });

  it("collects object menu item ids", () => {
    const item = makeMenuItem(30, "Tamales", 1, 850, "steamTable");
    const records: DailyAvailability[] = [
      {
        id: 3,
        date: "2026-07-08",
        menuItem: item,
        status: "soldOut",
        updatedAt: "",
        createdAt: "",
      },
    ];

    assert.ok(buildSoldOutSet(records).has(30));
  });
});

describe("groupItemsByCategory", () => {
  const mains = makeCategory(1, "Mains");
  const sides = makeCategory(2, "Sides");
  const empty = makeCategory(3, "Drinks");

  const itemA = makeMenuItem(1, "Pepián", mains, 1295, "steamTable");
  const itemB = makeMenuItem(2, "Tamales", mains, 850, "steamTable");
  const itemC = makeMenuItem(3, "Rice", sides, 400, "madeToOrder");
  const itemD = makeMenuItem(4, "Unknown", makeCategory(99, "Other"), 500);

  it("groups items by active category order", () => {
    const grouped = groupItemsByCategory([itemA, itemB, itemC, itemD], [mains, sides, empty]);

    assert.equal(grouped.length, 2);
    assert.equal(grouped[0].category.id, mains.id);
    assert.deepEqual(
      grouped[0].items.map((item) => item.id),
      [1, 2],
    );
    assert.equal(grouped[1].category.id, sides.id);
    assert.deepEqual(
      grouped[1].items.map((item) => item.id),
      [3],
    );
  });

  it("returns an empty array when no items match", () => {
    const grouped = groupItemsByCategory([], [mains, sides]);
    assert.equal(grouped.length, 0);
  });

  it("skips items whose category is not in the active list", () => {
    const grouped = groupItemsByCategory([itemD], [mains, sides]);
    assert.equal(grouped.length, 0);
  });
});

describe("formatToday", () => {
  it("formats the current date in the requested timezone", () => {
    const today = formatToday("America/New_York");
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("isItemAddDisabled", () => {
  it("disables items when the store is closed", () => {
    const item = makeMenuItem(1, "Pepián", 1, 1295, "madeToOrder");
    assert.equal(isItemAddDisabled(item, new Set(), false), true);
  });

  it("disables sold-out steam-table items", () => {
    const item = makeMenuItem(2, "Tamales", 1, 850, "steamTable");
    assert.equal(isItemAddDisabled(item, new Set([2]), true), true);
  });

  it("keeps available steam-table items enabled", () => {
    const item = makeMenuItem(3, "Rice", 1, 400, "steamTable");
    assert.equal(isItemAddDisabled(item, new Set([2]), true), false);
  });

  it("keeps made-to-order items enabled even when other items are sold out", () => {
    const item = makeMenuItem(4, "Horchata", 1, 350, "madeToOrder");
    assert.equal(isItemAddDisabled(item, new Set([2]), true), false);
  });

  it("keeps all items enabled when the store is open and nothing is sold out", () => {
    const item = makeMenuItem(5, "Pepián", 1, 1295, "steamTable");
    assert.equal(isItemAddDisabled(item, new Set(), true), false);
  });
});
