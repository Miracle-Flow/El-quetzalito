"use client";

import * as React from "react";

import { formatPrice } from "@/lib/menu-helpers.ts";

import { Label } from "@/components/ui/label";

import { Cluster, Stack } from "@/components/layout";
import { Typography } from "@/components/typography";

import type { MenuItem } from "../payload-types.ts";
import {
  buildModifierSelectorResult,
  createEmptySelection,
  getGroupConstraints,
  getSelectedOptionIds,
  resolveModifierGroups,
  toggleOption,
  validateGroup,
  type ModifierSelection,
  type ModifierSelectorResult,
  type ResolvedModifierGroup,
} from "./modifier-selector-logic.ts";

export interface ModifierSelectorProps {
  item: MenuItem;
  onChange: (result: ModifierSelectorResult) => void;
  initialSelection?: ModifierSelection;
}

function formatConstraintHint(group: ResolvedModifierGroup): string {
  const { min, max, required } = getGroupConstraints(group);
  const optionCount = group.options.length;

  if (required && min === 1 && max === 1) {
    return "Required · Choose 1";
  }

  if (required && min === max) {
    return `Required · Choose ${min}`;
  }

  if (required && max === optionCount) {
    return `Required · Choose at least ${min}`;
  }

  if (!required && max < optionCount) {
    return `Optional · Choose up to ${max}`;
  }

  if (!required && min === 0 && max === optionCount) {
    return "Optional";
  }

  return `Choose ${min}-${max}`;
}

function ModifierGroupField({
  group,
  selection,
  onToggle,
}: {
  group: ResolvedModifierGroup;
  selection: ModifierSelection;
  onToggle: (group: ResolvedModifierGroup, optionId: number) => void;
}) {
  const selectedIds = getSelectedOptionIds(selection, group.id);
  const error = validateGroup(group, selection);
  const isPriced = group.pricingMode === "priced";
  const { isSingle } = getGroupConstraints(group);

  return (
    <Stack gap="3" align="start">
      <Cluster align="baseline" justify="between" gap="2" wrap>
        <Typography as="h4" variant="text-md" weight="semibold">
          {group.label}
        </Typography>
        <Typography variant="text-xs" textColor="muted">
          {formatConstraintHint(group)}
        </Typography>
      </Cluster>

      <Stack gap="2" align="start" className="w-full">
        {group.options.map((option) => {
          const isSelected = selectedIds.has(option.id);
          const inputId = `modifier-group-${group.id}-option-${option.id}`;

          return (
            <Label
              key={option.id}
              htmlFor={inputId}
              className="w-full cursor-pointer justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <Cluster align="center" gap="3">
                <input
                  id={inputId}
                  type={isSingle ? "radio" : "checkbox"}
                  name={`modifier-group-${group.id}`}
                  checked={isSelected}
                  onChange={() => onToggle(group, option.id)}
                  className="size-4 shrink-0 cursor-pointer accent-primary"
                />
                <Typography variant="text-sm">{option.label}</Typography>
              </Cluster>

              {isPriced && option.priceDelta > 0 && (
                <Typography variant="text-sm" textColor="muted">
                  +{formatPrice(option.priceDelta)}
                </Typography>
              )}
            </Label>
          );
        })}
      </Stack>

      {error && (
        <Typography variant="text-xs" textColor="destructive">
          {error.message}
        </Typography>
      )}
    </Stack>
  );
}

export function ModifierSelector({ item, onChange, initialSelection }: ModifierSelectorProps) {
  const groups = resolveModifierGroups(item);
  const [selection, setSelection] = React.useState(initialSelection ?? createEmptySelection());

  React.useEffect(() => {
    onChange(buildModifierSelectorResult(item.basePrice, groups, selection));
    // Only notify on mount and when the caller-provided initialSelection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (initialSelection) {
      setSelection(initialSelection);
    }
  }, [initialSelection]);

  function handleToggle(group: ResolvedModifierGroup, optionId: number) {
    const next = toggleOption(selection, group, optionId);
    setSelection(next);
    onChange(buildModifierSelectorResult(item.basePrice, groups, next));
  }

  if (groups.length === 0) {
    return null;
  }

  return (
    <Stack gap="6">
      {groups.map((group) => (
        <ModifierGroupField
          key={group.id}
          group={group}
          selection={selection}
          onToggle={handleToggle}
        />
      ))}
    </Stack>
  );
}
