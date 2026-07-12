import type { MenuItem } from "./types";

/**
 * Static marketing menu prices are dollars; cart + formatPrice expect cents.
 * Items with only `priceLabel` (variable pricing) cannot be added yet.
 */
export function canAddToCart(item: MenuItem): item is MenuItem & { price: number } {
  return typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0;
}
