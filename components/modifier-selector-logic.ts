import type { CartModifierOption } from "@/src/store/cart.ts";

import type { MenuItem, ModifierGroup, ModifierOption } from "../payload-types.ts";

export type ResolvedModifierOption = ModifierOption;

export type ResolvedModifierGroup = Omit<ModifierGroup, "options"> & {
  options: ResolvedModifierOption[];
};

export type GroupSelection = Set<number>;

export type ModifierSelection = Map<number, GroupSelection>;

export interface GroupConstraints {
  min: number;
  max: number;
  required: boolean;
  isSingle: boolean;
}

export interface ValidationError {
  groupId: number;
  message: string;
}

export interface ModifierSelectorResult {
  selection: ModifierSelection;
  isValid: boolean;
  provisionalPrice: number;
  cartModifiers: CartModifierOption[];
}

export function resolveGroupOptions(group: ModifierGroup): ResolvedModifierOption[] {
  if (!group.options) {
    return [];
  }

  return group.options.filter(
    (option): option is ResolvedModifierOption => typeof option === "object" && option !== null,
  );
}

export function resolveModifierGroups(
  item: Pick<MenuItem, "modifierGroups">,
): ResolvedModifierGroup[] {
  if (!item.modifierGroups) {
    return [];
  }

  return item.modifierGroups
    .filter((group): group is ModifierGroup => typeof group === "object" && group !== null)
    .map((group) => ({
      ...group,
      options: resolveGroupOptions(group),
    }));
}

export function getGroupConstraints(group: ResolvedModifierGroup): GroupConstraints {
  const isSingle = group.selectionType === "pickOne";
  const optionCount = group.options.length;

  let min = group.minSelection ?? (group.required ? 1 : 0);
  let max = group.maxSelection ?? (isSingle ? 1 : optionCount);

  min = Math.max(0, Math.min(min, optionCount));
  max = Math.max(min, Math.min(max, optionCount));

  return {
    min,
    max,
    required: group.required ?? false,
    isSingle,
  };
}

export function validateGroup(
  group: ResolvedModifierGroup,
  selection: ModifierSelection,
): ValidationError | null {
  const { min, max } = getGroupConstraints(group);
  const selected = selection.get(group.id) ?? new Set<number>();
  const count = selected.size;

  if (count < min) {
    return {
      groupId: group.id,
      message:
        min === 1
          ? `Please select an option for ${group.label}`
          : `Please select at least ${min} options for ${group.label}`,
    };
  }

  if (count > max) {
    return {
      groupId: group.id,
      message:
        max === 1
          ? `Please select only one option for ${group.label}`
          : `Please select at most ${max} options for ${group.label}`,
    };
  }

  return null;
}

export function validateSelection(
  groups: ResolvedModifierGroup[],
  selection: ModifierSelection,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const group of groups) {
    const error = validateGroup(group, selection);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

export function isSelectionValid(
  groups: ResolvedModifierGroup[],
  selection: ModifierSelection,
): boolean {
  return validateSelection(groups, selection).length === 0;
}

export function computeProvisionalPrice(
  basePrice: number,
  groups: ResolvedModifierGroup[],
  selection: ModifierSelection,
): number {
  let total = basePrice;

  for (const group of groups) {
    if (group.pricingMode !== "priced") {
      continue;
    }

    const selected = selection.get(group.id) ?? new Set<number>();
    for (const option of group.options) {
      if (selected.has(option.id)) {
        total += option.priceDelta;
      }
    }
  }

  return total;
}

export function toggleOption(
  selection: ModifierSelection,
  group: ResolvedModifierGroup,
  optionId: number,
): ModifierSelection {
  const { isSingle } = getGroupConstraints(group);
  const next = new Map(selection);

  if (isSingle) {
    next.set(group.id, new Set([optionId]));
    return next;
  }

  const current = new Set(selection.get(group.id));
  if (current.has(optionId)) {
    current.delete(optionId);
  } else {
    current.add(optionId);
  }

  if (current.size === 0) {
    next.delete(group.id);
  } else {
    next.set(group.id, current);
  }

  return next;
}

export function setOptionSelected(
  selection: ModifierSelection,
  groupId: number,
  optionId: number,
  selected: boolean,
): ModifierSelection {
  const next = new Map(selection);
  const current = new Set(selection.get(groupId));

  if (selected) {
    current.add(optionId);
  } else {
    current.delete(optionId);
  }

  if (current.size === 0) {
    next.delete(groupId);
  } else {
    next.set(groupId, current);
  }

  return next;
}

export function createEmptySelection(): ModifierSelection {
  return new Map();
}

export function getSelectedOptionIds(selection: ModifierSelection, groupId: number): Set<number> {
  return selection.get(groupId) ?? new Set<number>();
}

export function selectionToCartModifiers(
  groups: ResolvedModifierGroup[],
  selection: ModifierSelection,
): CartModifierOption[] {
  const result: CartModifierOption[] = [];

  for (const group of groups) {
    const selected = selection.get(group.id) ?? new Set<number>();
    for (const option of group.options) {
      if (selected.has(option.id)) {
        result.push({
          id: `${group.id}:${option.id}`,
          label: `${group.label}: ${option.label}`,
          priceDelta: group.pricingMode === "priced" ? option.priceDelta : 0,
        });
      }
    }
  }

  return result;
}

export function buildModifierSelectorResult(
  basePrice: number,
  groups: ResolvedModifierGroup[],
  selection: ModifierSelection,
): ModifierSelectorResult {
  return {
    selection,
    isValid: isSelectionValid(groups, selection),
    provisionalPrice: computeProvisionalPrice(basePrice, groups, selection),
    cartModifiers: selectionToCartModifiers(groups, selection),
  };
}
