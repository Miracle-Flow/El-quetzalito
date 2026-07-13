import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type AvailabilityType = "madeToOrder" | "steamTable";

export interface CartItemSnapshot {
  id: number;
  name: string;
  basePrice: number;
  category: string;
  categoryId: number;
  availabilityType: AvailabilityType;
}

export interface CartModifierOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface CartLine {
  lineId: string;
  itemSnapshot: CartItemSnapshot;
  quantity: number;
  modifiers: CartModifierOption[];
  notes?: string;
}

interface CartState {
  version: number;
  lines: CartLine[];
  _hasHydrated: boolean;
}

interface CartActions {
  addItem: (
    item: CartItemSnapshot,
    modifiers: CartModifierOption[],
    quantity?: number,
    notes?: string,
  ) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type CartStore = CartState & CartActions;

const STORAGE_KEY = "el-quetzalito-cart-v2";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {
    // Intentionally empty: SSR fallback.
  },
  removeItem: () => {
    // Intentionally empty: SSR fallback.
  },
};

function getDefaultStorage(): StateStorage {
  if (typeof window === "undefined") {
    return noopStorage;
  }
  return localStorage;
}

function buildLineId(itemId: number, modifiers: CartModifierOption[], notes?: string): string {
  const modifierIds = [...modifiers].map((modifier) => modifier.id).toSorted();
  const segments = [String(itemId), ...modifierIds];
  const trimmedNotes = notes?.trim();
  if (trimmedNotes) {
    segments.push(`notes:${trimmedNotes}`);
  }
  return segments.join(":");
}

export function computeLineSubtotal(line: CartLine): number {
  let modifiersTotal = 0;
  for (const modifier of line.modifiers) {
    modifiersTotal += modifier.priceDelta;
  }
  return line.quantity * (line.itemSnapshot.basePrice + modifiersTotal);
}

function makeLine(
  item: CartItemSnapshot,
  modifiers: CartModifierOption[],
  quantity: number,
  notes?: string,
): CartLine {
  const trimmedNotes = notes?.trim();
  return {
    lineId: buildLineId(item.id, modifiers, notes),
    itemSnapshot: item,
    modifiers: [...modifiers],
    quantity,
    notes: trimmedNotes,
  };
}

export function createCartStore(storage?: StateStorage) {
  return create<CartStore>()(
    persist(
      (set) => ({
        version: 2,
        lines: [],
        _hasHydrated: false,

        setHasHydrated: (hydrated) => {
          set({ _hasHydrated: hydrated });
        },

        addItem: (item, modifiers, quantity, notes) => {
          const normalizedQuantity = Math.max(1, Math.floor(quantity ?? 1));
          const lineId = buildLineId(item.id, modifiers, notes);

          set((state) => {
            const existingIndex = state.lines.findIndex((line) => line.lineId === lineId);

            if (existingIndex !== -1) {
              const nextLines = [...state.lines];
              nextLines[existingIndex] = {
                ...nextLines[existingIndex],
                quantity: nextLines[existingIndex].quantity + normalizedQuantity,
              };
              return { lines: nextLines };
            }

            return {
              lines: [...state.lines, makeLine(item, modifiers, normalizedQuantity, notes)],
            };
          });
        },

        updateQuantity: (lineId, quantity) => {
          const normalizedQuantity = Math.floor(quantity);

          set((state) => {
            if (normalizedQuantity <= 0) {
              return {
                lines: state.lines.filter((line) => line.lineId !== lineId),
              };
            }

            const existingIndex = state.lines.findIndex((line) => line.lineId === lineId);

            if (existingIndex === -1) {
              return state;
            }

            const nextLines = [...state.lines];
            nextLines[existingIndex] = {
              ...nextLines[existingIndex],
              quantity: normalizedQuantity,
            };
            return { lines: nextLines };
          });
        },

        removeItem: (lineId) => {
          set((state) => ({
            lines: state.lines.filter((line) => line.lineId !== lineId),
          }));
        },

        clearCart: () => {
          set({ lines: [] });
        },
      }),
      {
        name: STORAGE_KEY,
        storage: storage ? createJSONStorage(() => storage) : createJSONStorage(getDefaultStorage),
        partialize: (state) => ({
          version: state.version,
          lines: state.lines,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            return;
          }
          state?.setHasHydrated(true);
        },
        version: 2,
      },
    ),
  );
}

export const useCartStore = createCartStore();

export function selectSubtotal(state: CartState): number {
  let total = 0;
  for (const line of state.lines) {
    total += computeLineSubtotal(line);
  }
  return total;
}

export function selectItemCount(state: CartState): number {
  let count = 0;
  for (const line of state.lines) {
    count += line.quantity;
  }
  return count;
}

export function selectLineCount(state: CartState): number {
  return state.lines.length;
}

export function selectHasHydrated(state: CartState): boolean {
  return state._hasHydrated;
}
