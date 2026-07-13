"use client";

import * as React from "react";

import { formatPrice, getCategoryId } from "@/lib/menu-helpers.ts";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

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
  const groups = resolveModifierGroups(item);
  const hasModifiers = groups.length > 0;

  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(MIN_QUANTITY);
  const [selection, setSelection] = React.useState<ModifierSelection>(createEmptySelection());
  const [isValid, setIsValid] = React.useState(!hasModifiers);
  const [provisionalPrice, setProvisionalPrice] = React.useState(item.basePrice);
  const [cartModifiers, setCartModifiers] = React.useState<CartModifierOption[]>([]);
  const [notes, setNotes] = React.useState("");

  function resetState() {
    setQuantity(MIN_QUANTITY);
    const empty = createEmptySelection();
    setSelection(empty);
    setIsValid(!hasModifiers);
    setProvisionalPrice(item.basePrice);
    setCartModifiers([]);
    setNotes("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      resetState();
    }
    setOpen(nextOpen);
  }

  function handleClick() {
    if (disabled) {
      return;
    }
    handleOpenChange(true);
  }

  function handleAddToCart() {
    if (!isValid || disabled) {
      return;
    }

    const trimmedNotes = notes.trim();
    useCartStore
      .getState()
      .addItem(buildItemSnapshot(item), cartModifiers, quantity, trimmedNotes || undefined);
    setOpen(false);
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

      <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
        <DrawerContent className="max-h-[92dvh]">
          <DrawerHeader className="flex-row items-start justify-between">
            <Stack gap="1" align="start">
              <DrawerTitle className="text-lg font-semibold">{item.name}</DrawerTitle>
              <DrawerDescription>
                {formatPrice(item.basePrice)}
                {item.description ? ` · ${item.description}` : ""}
              </DrawerDescription>
            </Stack>
            <DrawerClose
              render={<Button variant="ghost" size="icon-xs" aria-label="Close configurator" />}
            >
              <RenderIcon icon={CloseIcon} size={16} />
            </DrawerClose>
          </DrawerHeader>

          <Box className="flex-1 overflow-y-auto px-4 pb-2">
            <Stack gap="6">
              {hasModifiers && (
                <ModifierSelector
                  item={item}
                  onChange={handleSelectionChange}
                  initialSelection={selection}
                />
              )}

              <Field>
                <FieldLabel htmlFor={`item-notes-${item.id}`}>Special notes</FieldLabel>
                <Textarea
                  id={`item-notes-${item.id}`}
                  placeholder="Any extra requests? (e.g. no cilantro, extra spicy, well done)"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </Field>
            </Stack>
          </Box>

          <DrawerFooter className="flex-row items-center justify-between gap-4">
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

            <Button onClick={handleAddToCart} disabled={!isValid} className="flex-1">
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
