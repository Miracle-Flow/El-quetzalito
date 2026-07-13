import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { MenuItem, ModifierGroup, ModifierOption } from "../payload-types.ts";
import {
  buildModifierSelectorResult,
  computeProvisionalPrice,
  createEmptySelection,
  getGroupConstraints,
  getSelectedOptionIds,
  resolveModifierGroups,
  selectionToCartModifiers,
  setOptionSelected,
  toggleOption,
  validateSelection,
  type ResolvedModifierGroup,
} from "./modifier-selector-logic.ts";

function makeOption(id: number, label: string, priceDelta = 0): ModifierOption {
  return {
    id,
    label,
    priceDelta,
    group: 1,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function makeGroup(
  id: number,
  label: string,
  selectionType: ModifierGroup["selectionType"],
  options: ModifierOption[],
  overrides: Partial<ResolvedModifierGroup> = {},
): ResolvedModifierGroup {
  return {
    id,
    label,
    selectionType,
    required: false,
    minSelection: null,
    maxSelection: null,
    pricingMode: "included",
    options,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeItem(modifierGroups: ModifierGroup[] = [], basePrice = 1000): MenuItem {
  return {
    id: 1,
    name: "Test Item",
    slug: "test-item",
    description: null,
    basePrice,
    category: 1,
    availabilityType: "madeToOrder",
    active: true,
    image: null,
    modifierGroups,
    sortOrder: 1,
    updatedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("resolveModifierGroups", () => {
  it("returns an empty array when item has no modifier groups", () => {
    const item = makeItem();
    assert.deepEqual(resolveModifierGroups(item), []);
  });

  it("skips unresolved numeric group references", () => {
    const item = makeItem();
    item.modifierGroups = [1, 2];
    assert.deepEqual(resolveModifierGroups(item), []);
  });

  it("resolves populated groups with their options", () => {
    const option = makeOption(10, "Option A");
    const group = makeGroup(1, "Salsa", "pickOne", [option]);
    const item = makeItem([group]);

    const resolved = resolveModifierGroups(item);
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].id, 1);
    assert.equal(resolved[0].options.length, 1);
    assert.equal(resolved[0].options[0].id, 10);
  });
});

describe("getGroupConstraints", () => {
  it("defaults single group to required=1, max=1 when required is true", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild"), makeOption(2, "Hot")]);
    group.required = true;
    const constraints = getGroupConstraints(group);
    assert.deepEqual(constraints, { min: 1, max: 1, required: true, isSingle: true });
  });

  it("defaults single group to min=0, max=1 when not required", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild"), makeOption(2, "Hot")]);
    const constraints = getGroupConstraints(group);
    assert.deepEqual(constraints, { min: 0, max: 1, required: false, isSingle: true });
  });

  it("defaults multiple group max to option count", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [
      makeOption(1, "Cheese"),
      makeOption(2, "Beans"),
      makeOption(3, "Rice"),
    ]);
    const constraints = getGroupConstraints(group);
    assert.deepEqual(constraints, { min: 0, max: 3, required: false, isSingle: false });
  });

  it("respects explicit min and max values", () => {
    const group = makeGroup(
      1,
      "Toppings",
      "pickMany",
      [makeOption(1, "A"), makeOption(2, "B"), makeOption(3, "C")],
      { minSelection: 1, maxSelection: 2 },
    );
    const constraints = getGroupConstraints(group);
    assert.deepEqual(constraints, { min: 1, max: 2, required: false, isSingle: false });
  });

  it("clamps max to the number of options", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [makeOption(1, "A"), makeOption(2, "B")], {
      maxSelection: 10,
    });
    const constraints = getGroupConstraints(group);
    assert.equal(constraints.max, 2);
  });

  it("clamps min to the number of options", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [makeOption(1, "A"), makeOption(2, "B")], {
      minSelection: 5,
    });
    const constraints = getGroupConstraints(group);
    assert.equal(constraints.min, 2);
  });
});

describe("toggleOption", () => {
  it("selects an option in a single group", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild"), makeOption(2, "Hot")]);
    const selection = toggleOption(createEmptySelection(), group, 1);
    assert.deepEqual([...selection.get(1)!], [1]);
  });

  it("replaces the previous selection in a single group", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild"), makeOption(2, "Hot")]);
    let selection = toggleOption(createEmptySelection(), group, 1);
    selection = toggleOption(selection, group, 2);
    assert.deepEqual([...selection.get(1)!], [2]);
  });

  it("adds an option in a multiple group", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [
      makeOption(1, "Cheese"),
      makeOption(2, "Beans"),
    ]);
    const selection = toggleOption(createEmptySelection(), group, 1);
    assert.deepEqual([...selection.get(1)!], [1]);
  });

  it("removes an already-selected option in a multiple group", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [
      makeOption(1, "Cheese"),
      makeOption(2, "Beans"),
    ]);
    let selection = toggleOption(createEmptySelection(), group, 1);
    selection = toggleOption(selection, group, 2);
    selection = toggleOption(selection, group, 1);
    assert.deepEqual(
      [...selection.get(1)!].toSorted((a, b) => a - b),
      [2],
    );
  });
});

describe("validateSelection", () => {
  it("passes for empty selection when all groups are optional", () => {
    const group = makeGroup(1, "Toppings", "pickMany", [makeOption(1, "Cheese")]);
    assert.equal(validateSelection([group], createEmptySelection()).length, 0);
  });

  it("fails when a required single group has no selection", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild")], {
      required: true,
    });
    const errors = validateSelection([group], createEmptySelection());
    assert.equal(errors.length, 1);
    assert.equal(errors[0].groupId, 1);
  });

  it("passes when a required single group has a selection", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild")], {
      required: true,
    });
    const selection = setOptionSelected(createEmptySelection(), 1, 1, true);
    assert.equal(validateSelection([group], selection).length, 0);
  });

  it("fails when selection count is below min", () => {
    const group = makeGroup(
      1,
      "Toppings",
      "pickMany",
      [makeOption(1, "A"), makeOption(2, "B"), makeOption(3, "C")],
      { minSelection: 2 },
    );
    const selection = setOptionSelected(createEmptySelection(), 1, 1, true);
    const errors = validateSelection([group], selection);
    assert.equal(errors.length, 1);
  });

  it("fails when selection count exceeds max", () => {
    const group = makeGroup(
      1,
      "Toppings",
      "pickMany",
      [makeOption(1, "A"), makeOption(2, "B"), makeOption(3, "C")],
      { maxSelection: 1 },
    );
    let selection = setOptionSelected(createEmptySelection(), 1, 1, true);
    selection = setOptionSelected(selection, 1, 2, true);
    const errors = validateSelection([group], selection);
    assert.equal(errors.length, 1);
  });
});

describe("computeProvisionalPrice", () => {
  it("returns base price with no selection", () => {
    const item = makeItem([], 1000);
    const groups = resolveModifierGroups(item);
    assert.equal(computeProvisionalPrice(item.basePrice, groups, createEmptySelection()), 1000);
  });

  it("ignores included-mode options", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Hot", 100)], {
      pricingMode: "included",
    });
    const item = makeItem([group], 1000);
    const groups = resolveModifierGroups(item);
    const selection = setOptionSelected(createEmptySelection(), 1, 1, true);
    assert.equal(computeProvisionalPrice(item.basePrice, groups, selection), 1000);
  });

  it("adds priced option deltas", () => {
    const group = makeGroup(
      1,
      "Add-ons",
      "pickMany",
      [makeOption(1, "Extra cheese", 150), makeOption(2, "Bacon", 200)],
      { pricingMode: "priced" },
    );
    const item = makeItem([group], 1000);
    const groups = resolveModifierGroups(item);
    let selection = setOptionSelected(createEmptySelection(), 1, 1, true);
    selection = setOptionSelected(selection, 1, 2, true);
    assert.equal(computeProvisionalPrice(item.basePrice, groups, selection), 1350);
  });
});

describe("selectionToCartModifiers", () => {
  it("returns empty array for empty selection", () => {
    const item = makeItem();
    assert.deepEqual(
      selectionToCartModifiers(resolveModifierGroups(item), createEmptySelection()),
      [],
    );
  });

  it("builds cart modifiers with composite ids and priced deltas", () => {
    const group = makeGroup(1, "Add-ons", "pickMany", [makeOption(10, "Extra cheese", 150)], {
      pricingMode: "priced",
    });
    const item = makeItem([group]);
    const groups = resolveModifierGroups(item);
    const selection = setOptionSelected(createEmptySelection(), 1, 10, true);
    const modifiers = selectionToCartModifiers(groups, selection);
    assert.equal(modifiers.length, 1);
    assert.equal(modifiers[0].id, "1:10");
    assert.equal(modifiers[0].label, "Add-ons: Extra cheese");
    assert.equal(modifiers[0].priceDelta, 150);
  });

  it("zeroes deltas for included-mode options", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(10, "Hot", 100)], {
      pricingMode: "included",
    });
    const item = makeItem([group]);
    const groups = resolveModifierGroups(item);
    const selection = setOptionSelected(createEmptySelection(), 1, 10, true);
    const modifiers = selectionToCartModifiers(groups, selection);
    assert.equal(modifiers[0].priceDelta, 0);
  });
});

describe("buildModifierSelectorResult", () => {
  it("reports invalid when required group is empty", () => {
    const group = makeGroup(1, "Salsa", "pickOne", [makeOption(1, "Mild")], {
      required: true,
    });
    const item = makeItem([group], 1000);
    const result = buildModifierSelectorResult(
      item.basePrice,
      resolveModifierGroups(item),
      createEmptySelection(),
    );
    assert.equal(result.isValid, false);
    assert.equal(result.provisionalPrice, 1000);
    assert.equal(result.cartModifiers.length, 0);
  });

  it("reports valid with priced modifiers", () => {
    const group = makeGroup(1, "Add-ons", "pickMany", [makeOption(10, "Extra cheese", 150)], {
      pricingMode: "priced",
    });
    const item = makeItem([group], 1000);
    const selection = setOptionSelected(createEmptySelection(), 1, 10, true);
    const result = buildModifierSelectorResult(
      item.basePrice,
      resolveModifierGroups(item),
      selection,
    );
    assert.equal(result.isValid, true);
    assert.equal(result.provisionalPrice, 1150);
    assert.equal(result.cartModifiers.length, 1);
  });
});

describe("getSelectedOptionIds", () => {
  it("returns empty set when group has no selection", () => {
    assert.equal(getSelectedOptionIds(createEmptySelection(), 1).size, 0);
  });

  it("returns the selected option ids for a group", () => {
    const selection = setOptionSelected(createEmptySelection(), 1, 10, true);
    assert.deepEqual([...getSelectedOptionIds(selection, 1)], [10]);
  });
});
