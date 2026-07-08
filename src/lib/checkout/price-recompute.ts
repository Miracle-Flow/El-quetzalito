import type { DailyAvailability, MenuItem, ModifierOption } from "@/payload-types.ts";

import type { CartLine } from "./schemas.ts";

export interface CatalogData {
  items: ReadonlyMap<number, MenuItem>;
  options: ReadonlyMap<number, ModifierOption>;
  availability: ReadonlyMap<number, DailyAvailability>;
  itemOptionIds: ReadonlyMap<number, ReadonlySet<number>>;
}

export interface LineValidationError {
  lineItemId: number;
  messages: string[];
}

export interface RecomputeResult {
  subtotalCents: number;
  lineErrors: LineValidationError[];
}

function getLineUnitCents(line: CartLine, catalog: CatalogData, messages: string[]): number {
  const item = catalog.items.get(line.itemId);

  if (!item) {
    messages.push(`Item "${line.name}" is no longer available.`);
    return line.basePriceCents;
  }

  if (!item.active) {
    messages.push(`Item "${item.name}" is currently unavailable.`);
  }

  const availability = catalog.availability.get(line.itemId);
  if (availability?.status === "soldOut") {
    messages.push(`Item "${item.name}" is sold out today.`);
  }

  if (item.basePrice !== line.basePriceCents) {
    messages.push(`Price for "${item.name}" has changed.`);
  }

  let unitCents = item.basePrice;
  const allowedOptions = catalog.itemOptionIds.get(item.id);

  for (const modifier of line.modifiers) {
    const option = catalog.options.get(modifier.optionId);

    if (!option) {
      messages.push(`Modifier "${modifier.label}" is no longer available.`);
      unitCents += modifier.priceDeltaCents;
      continue;
    }

    if (option.priceDelta !== modifier.priceDeltaCents) {
      messages.push(`Price for modifier "${option.label}" has changed.`);
    }

    if (allowedOptions && !allowedOptions.has(modifier.optionId)) {
      messages.push(`Modifier "${option.label}" is not valid for "${item.name}".`);
    }

    unitCents += option.priceDelta;
  }

  return unitCents;
}

export function recomputePrice(catalog: CatalogData, lines: CartLine[]): RecomputeResult {
  let subtotalCents = 0;
  const lineErrors: LineValidationError[] = [];

  for (const line of lines) {
    const messages: string[] = [];
    const unitCents = getLineUnitCents(line, catalog, messages);

    subtotalCents += unitCents * line.quantity;

    if (messages.length > 0) {
      lineErrors.push({ lineItemId: line.itemId, messages });
    }
  }

  return { subtotalCents, lineErrors };
}
