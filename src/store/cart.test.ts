import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { StateStorage } from "zustand/middleware";

import {
  computeLineSubtotal,
  createCartStore,
  selectHasHydrated,
  selectItemCount,
  selectLineCount,
  selectSubtotal,
  type CartItemSnapshot,
  type CartModifierOption,
} from "./cart.ts";

function makeItem(
  id: number,
  name: string,
  basePrice: number,
  category = "Mains",
  availabilityType: CartItemSnapshot["availabilityType"] = "madeToOrder",
): CartItemSnapshot {
  return {
    id,
    name,
    basePrice,
    category,
    categoryId: 1,
    availabilityType,
  };
}

function makeModifier(id: string, label: string, priceDelta: number): CartModifierOption {
  return { id, label, priceDelta };
}

function makeTestStorage(): StateStorage {
  const store: Record<string, string> = {};
  return {
    getItem: (name) => store[name] ?? null,
    setItem: (name, value) => {
      store[name] = value;
    },
    removeItem: (name) => {
      delete store[name];
    },
  };
}

function makeDeferredStorage(): { storage: StateStorage; resolve: () => void } {
  let resolveFn: () => void = () => {
    // Initial no-op until the Promise executor assigns the real resolver.
  };
  const gate = new Promise<void>((resolve) => {
    resolveFn = resolve;
  });
  const store: Record<string, string> = {};
  const storage: StateStorage = {
    getItem: async () => {
      await gate;
      return store["el-quetzalito-cart"] ?? null;
    },
    setItem: (name, value) => {
      store[name] = value;
    },
    removeItem: (name) => {
      delete store[name];
    },
  };
  return { storage, resolve: resolveFn };
}

function waitForHydration(store: ReturnType<typeof createCartStore>) {
  return store.persist.rehydrate();
}

describe("computeLineSubtotal", () => {
  it("multiplies base price by quantity when there are no modifiers", () => {
    const line = {
      lineId: "1",
      itemSnapshot: makeItem(1, "Pepián", 1295),
      quantity: 2,
      modifiers: [],
    };
    assert.equal(computeLineSubtotal(line), 2590);
  });

  it("adds modifier price deltas to the base price before multiplying", () => {
    const line = {
      lineId: "1",
      itemSnapshot: makeItem(1, "Pepián", 1295),
      quantity: 2,
      modifiers: [makeModifier("extra-meat", "Extra Meat", 200), makeModifier("spicy", "Spicy", 0)],
    };
    assert.equal(computeLineSubtotal(line), 2990);
  });
});

describe("addItem", () => {
  it("adds a new line to an empty cart", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    store.getState().addItem(item, [makeModifier("extra-meat", "Extra Meat", 200)], 2);

    const state = store.getState();
    assert.equal(state.lines.length, 1);
    assert.equal(state.lines[0].quantity, 2);
    assert.equal(state.lines[0].itemSnapshot.id, 1);
    assert.equal(state.lines[0].modifiers.length, 1);
  });

  it("merges duplicate item and modifier combinations", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    const modifiers = [makeModifier("extra-meat", "Extra Meat", 200)];
    store.getState().addItem(item, modifiers, 1);
    store.getState().addItem(item, modifiers, 2);

    const state = store.getState();
    assert.equal(state.lines.length, 1);
    assert.equal(state.lines[0].quantity, 3);
  });

  it("creates separate lines for different modifiers", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    store.getState().addItem(item, [makeModifier("mild", "Mild", 0)], 1);
    store.getState().addItem(item, [makeModifier("spicy", "Spicy", 0)], 1);

    const state = store.getState();
    assert.equal(state.lines.length, 2);
  });

  it("ignores modifier order when merging", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    const modifierA = makeModifier("a", "A", 100);
    const modifierB = makeModifier("b", "B", 200);
    store.getState().addItem(item, [modifierA, modifierB], 1);
    store.getState().addItem(item, [modifierB, modifierA], 1);

    const state = store.getState();
    assert.equal(state.lines.length, 1);
    assert.equal(state.lines[0].quantity, 2);
  });

  it("defaults quantity to one when omitted", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), []);

    assert.equal(store.getState().lines[0].quantity, 1);
  });

  it("clamps fractional quantities down to the nearest integer", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 2.9);

    assert.equal(store.getState().lines[0].quantity, 2);
  });

  it("treats quantities below one as one", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 0);

    assert.equal(store.getState().lines[0].quantity, 1);
  });
});

describe("updateQuantity", () => {
  it("updates an existing line quantity", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    store.getState().addItem(item, [], 2);
    const lineId = store.getState().lines[0].lineId;

    store.getState().updateQuantity(lineId, 5);

    assert.equal(store.getState().lines[0].quantity, 5);
  });

  it("removes the line when quantity is zero", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    store.getState().addItem(item, [], 2);
    const lineId = store.getState().lines[0].lineId;

    store.getState().updateQuantity(lineId, 0);

    assert.equal(store.getState().lines.length, 0);
  });

  it("removes the line when quantity is negative", () => {
    const store = createCartStore(makeTestStorage());
    const item = makeItem(1, "Pepián", 1295);
    store.getState().addItem(item, [], 1);
    const lineId = store.getState().lines[0].lineId;

    store.getState().updateQuantity(lineId, -1);

    assert.equal(store.getState().lines.length, 0);
  });

  it("ignores updates to unknown line ids", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 1);

    store.getState().updateQuantity("unknown", 3);

    assert.equal(store.getState().lines.length, 1);
    assert.equal(store.getState().lines[0].quantity, 1);
  });
});

describe("removeItem", () => {
  it("removes the line with the given line id", () => {
    const store = createCartStore(makeTestStorage());
    const itemA = makeItem(1, "Pepián", 1295);
    const itemB = makeItem(2, "Tamales", 850);
    store.getState().addItem(itemA, [], 1);
    store.getState().addItem(itemB, [], 1);

    const lineId = store.getState().lines[0].lineId;
    store.getState().removeItem(lineId);

    assert.equal(store.getState().lines.length, 1);
    assert.equal(store.getState().lines[0].itemSnapshot.id, 2);
  });
});

describe("clearCart", () => {
  it("removes all lines", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 1);
    store.getState().addItem(makeItem(2, "Tamales", 850), [], 1);

    store.getState().clearCart();

    assert.equal(store.getState().lines.length, 0);
  });
});

describe("selectors", () => {
  it("computes subtotal across all lines", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [makeModifier("extra", "Extra", 200)], 2);
    store.getState().addItem(makeItem(2, "Tamales", 850), [], 1);

    assert.equal(selectSubtotal(store.getState()), 3840);
  });

  it("computes item count as the sum of quantities", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 2);
    store.getState().addItem(makeItem(2, "Tamales", 850), [], 3);

    assert.equal(selectItemCount(store.getState()), 5);
  });

  it("computes line count as the number of lines", () => {
    const store = createCartStore(makeTestStorage());
    store.getState().addItem(makeItem(1, "Pepián", 1295), [], 1);
    store.getState().addItem(makeItem(1, "Pepián", 1295), [makeModifier("extra", "Extra", 200)], 1);

    assert.equal(selectLineCount(store.getState()), 2);
  });
});

describe("hydration", () => {
  it("reports not hydrated before rehydration", async () => {
    const { storage, resolve } = makeDeferredStorage();
    const store = createCartStore(storage);
    assert.equal(selectHasHydrated(store.getState()), false);
    resolve();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    assert.equal(selectHasHydrated(store.getState()), true);
  });

  it("reports hydrated after rehydration", async () => {
    const store = createCartStore(makeTestStorage());
    await waitForHydration(store);
    assert.equal(selectHasHydrated(store.getState()), true);
  });
});

describe("persistence", () => {
  it("round-trips cart lines through storage", async () => {
    const storage = makeTestStorage();
    const storeA = createCartStore(storage);
    const item = makeItem(1, "Pepián", 1295, "Mains", "steamTable");
    const modifier = makeModifier("extra-meat", "Extra Meat", 200);
    storeA.getState().addItem(item, [modifier], 2);

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    const storeB = createCartStore(storage);
    await waitForHydration(storeB);

    const state = storeB.getState();
    assert.equal(state.lines.length, 1);
    assert.equal(state.lines[0].itemSnapshot.id, 1);
    assert.equal(state.lines[0].itemSnapshot.name, "Pepián");
    assert.equal(state.lines[0].itemSnapshot.basePrice, 1295);
    assert.equal(state.lines[0].itemSnapshot.category, "Mains");
    assert.equal(state.lines[0].itemSnapshot.availabilityType, "steamTable");
    assert.equal(state.lines[0].quantity, 2);
    assert.equal(state.lines[0].modifiers.length, 1);
    assert.equal(state.lines[0].modifiers[0].id, "extra-meat");
    assert.equal(state.lines[0].modifiers[0].label, "Extra Meat");
    assert.equal(state.lines[0].modifiers[0].priceDelta, 200);
    assert.equal(selectSubtotal(state), 2990);
    assert.equal(selectHasHydrated(state), true);
  });
});
