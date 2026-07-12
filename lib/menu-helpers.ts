import { formatInTimeZone } from "date-fns-tz";

import type { Category, DailyAvailability, MenuItem } from "../payload-types.ts";

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getCategoryId(category: number | Category): number {
  return typeof category === "number" ? category : category.id;
}

export function getCategoryName(category: number | Category, fallback = "Menu"): string {
  return typeof category === "number" ? fallback : (category.name ?? fallback);
}

export function buildSoldOutSet(records: DailyAvailability[]): Set<number> {
  return new Set(
    records.map((record) =>
      typeof record.menuItem === "number" ? record.menuItem : record.menuItem.id,
    ),
  );
}

export function groupItemsByCategory(
  items: MenuItem[],
  categories: Category[],
): { category: Category; items: MenuItem[] }[] {
  const allowed = new Set(categories.map((category) => category.id));
  const groups = new Map<number, MenuItem[]>();

  for (const item of items) {
    const categoryId = getCategoryId(item.category);
    if (!allowed.has(categoryId)) {
      continue;
    }

    const group = groups.get(categoryId) ?? [];
    group.push(item);
    groups.set(categoryId, group);
  }

  return categories
    .map((category) => ({
      category,
      items: groups.get(category.id) ?? [],
    }))
    .filter((group) => group.items.length > 0);
}

export function formatToday(timeZone: string): string {
  return formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");
}

export function isItemAddDisabled(
  item: MenuItem,
  soldOutIds: Set<number>,
  isOpen: boolean,
): boolean {
  if (!isOpen) {
    return true;
  }

  return item.availabilityType === "steamTable" && soldOutIds.has(item.id);
}
