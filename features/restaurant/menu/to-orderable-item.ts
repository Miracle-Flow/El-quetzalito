import type { MenuItem as PayloadMenuItem } from "@/payload-types";

import type { MenuItem } from "./types";

/** Stable positive int from a string (slug / category id) for cart line keys. */
export function stableId(key: string): number {
  let hash = 0;
  for (const char of key) {
    const code = char.codePointAt(0) ?? 0;
    hash = Math.trunc(Math.imul(31, hash) + code);
  }
  const id = Math.abs(hash);
  return id === 0 ? 1 : id;
}

/**
 * Static marketing menu prices are dollars; cart + formatPrice expect cents.
 * Items with only `priceLabel` (variable pricing) cannot be added yet.
 */
export function canAddToCart(item: MenuItem): item is MenuItem & { price: number } {
  return typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0;
}

export function toOrderableItem(
  item: MenuItem,
  category: { id: string; label: string },
): PayloadMenuItem | null {
  if (!canAddToCart(item)) {
    return null;
  }

  const categoryId = stableId(category.id);
  const now = new Date(0).toISOString();

  return {
    id: stableId(item.slug),
    name: item.name,
    slug: item.slug,
    description: item.description ?? null,
    basePrice: Math.round(item.price * 100),
    category: {
      id: categoryId,
      name: category.label,
      slug: category.id,
      description: null,
      menu: null,
      sortOrder: 0,
      active: true,
      updatedAt: now,
      createdAt: now,
    },
    availabilityType: "madeToOrder",
    active: true,
    image: null,
    modifierGroups: null,
    sortOrder: 0,
    updatedAt: now,
    createdAt: now,
  };
}
