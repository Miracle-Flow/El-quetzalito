"use client";

import * as React from "react";

import { formatPrice, getCategoryId } from "@/lib/menu-helpers.ts";

import { Button } from "@/components/ui/button";

import { Box, Cluster, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

import { useCartStore, type CartItemSnapshot, type CartModifierOption } from "@/src/store/cart.ts";

import type { MenuItem } from "../payload-types.ts";
import { CartIcon, CloseIcon, MinusIcon, PlusIcon } from "./icons.tsx";
import {
  createEmptySelection,
  resolveModifierGroups,
  type ModifierSelection,
} from "./modifier-selector-logic.ts";
import { ModifierSelector } from "./modifier-selector.tsx";

export interface MenuItemConfiguratorProps {
  item: MenuItem;
  disabled?: boolean;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;

export function MenuItemConfigurator({ item, disabled = false }: MenuItemConfiguratorProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const groups = resolveModifierGroups(item);
  const hasModifiers = groups.length > 0;

  const [quantity, setQuantity] = React.useState(MIN_QUANTITY);
  const [selection, setSelection] = React.useState<ModifierSelection>(createEmptySelection());
  const [isValid, setIsValid] = React.useState(!hasModifiers);
  const [provisionalPrice, setProvisionalPrice] = React.useState(item.basePrice);
  const [cartModifiers, setCartModifiers] = React.useState<CartModifierOption[]>([]);

  function resetState() {
    setQuantity(MIN_QUANTITY);
    const empty = createEmptySelection();
    setSelection(empty);
    setIsValid(!hasModifiers);
    setProvisionalPrice(item.basePrice);
    setCartModifiers([]);
  }

  function openDialog() {
    if (disabled) {
      return;
    }

    resetState();
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function addToCartDirectly() {
    if (disabled) {
      return;
    }

    useCartStore.getState().addItem(buildItemSnapshot(item), [], MIN_QUANTITY);
  }

  function addToCartWithModifiers() {
    if (!isValid) {
      return;
    }

    useCartStore.getState().addItem(buildItemSnapshot(item), cartModifiers, quantity);
    closeDialog();
  }

  function handleClick() {
    if (hasModifiers) {
      openDialog();
    } else {
      addToCartDirectly();
    }
  }

  function handleSelectionChange(result: {
    selection: ModifierSelection;
    isValid: boolean;
    provisionalPrice: number;
    cartModifiers: CartModifierOption[];
  }) {
    setSelection(result.selection);
    setIsValid(result.isValid);
    setProvisionalPrice(result.provisionalPrice);
    setCartModifiers(result.cartModifiers);
  }

  function decrementQuantity() {
    setQuantity((current) => Math.max(MIN_QUANTITY, current - 1));
  }

  function incrementQuantity() {
    setQuantity((current) => Math.min(MAX_QUANTITY, current + 1));
  }

  const totalPrice = provisionalPrice * quantity;

  return (
    <>
      <Button
        size="sm"
        disabled={disabled}
        onClick={handleClick}
        aria-label={`Add ${item.name} to cart`}
      >
        <RenderIcon icon={CartIcon} size={16} />
        Add to cart
      </Button>

      {hasModifiers && (
        <dialog
          ref={dialogRef}
          className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-card p-0 text-card-foreground shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === dialogRef.current) {
              closeDialog();
            }
          }}
        >
          <Box p="6">
            <Stack gap="6">
              <Cluster align="start" justify="between" gap="3">
                <Stack gap="1" align="start">
                  <Typography as="h3" variant="h5" weight="semibold">
                    {item.name}
                  </Typography>
                  <Typography variant="text-sm" weight="semibold" textColor="primary">
                    {formatPrice(item.basePrice)}
                  </Typography>
                </Stack>

                <Button variant="ghost" size="icon-xs" onClick={closeDialog} aria-label="Close">
                  <RenderIcon icon={CloseIcon} size={16} />
                </Button>
              </Cluster>

              {item.description && (
                <Typography variant="text-sm" textColor="muted">
                  {item.description}
                </Typography>
              )}

              <ModifierSelector
                item={item}
                onChange={handleSelectionChange}
                initialSelection={selection}
              />

              <Cluster align="center" justify="between" gap="3" wrap>
                <Typography variant="text-sm" weight="medium">
                  Quantity
                </Typography>

                <Cluster align="center" gap="2">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={decrementQuantity}
                    disabled={quantity <= MIN_QUANTITY}
                    aria-label="Decrease quantity"
                  >
                    <RenderIcon icon={MinusIcon} size={14} />
                  </Button>

                  <Box px="3" py="1" bg="muted" radius="md">
                    <Typography variant="text-sm" weight="semibold">
                      {quantity}
                    </Typography>
                  </Box>

                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={incrementQuantity}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label="Increase quantity"
                  >
                    <RenderIcon icon={PlusIcon} size={14} />
                  </Button>
                </Cluster>
              </Cluster>

              <Button onClick={addToCartWithModifiers} disabled={!isValid} className="w-full">
                <Cluster align="center" justify="between" gap="2" className="w-full">
                  <Cluster align="center" gap="2">
                    <RenderIcon icon={CartIcon} size={16} />
                    Add {quantity} to cart
                  </Cluster>

                  <Typography as="span" variant="text-sm" weight="semibold" textColor="inherit">
                    {formatPrice(totalPrice)}
                  </Typography>
                </Cluster>
              </Button>
            </Stack>
          </Box>
        </dialog>
      )}
    </>
  );
}

function buildItemSnapshot(item: MenuItem): CartItemSnapshot {
  return {
    id: item.id,
    name: item.name,
    basePrice: item.basePrice,
    category:
      typeof item.category === "number" ? String(item.category) : (item.category.name ?? "Menu"),
    categoryId: getCategoryId(item.category),
    availabilityType: item.availabilityType,
  };
}
