"use client";

import type { ElementType } from "react";

import {
  Minus as _Minus,
  Plus as _Plus,
  ShoppingCart as _ShoppingCart,
  Trash2 as _Trash2,
  X as _X,
} from "lucide-react";

export interface SvgAsset {
  readonly src: string;
  readonly width?: number;
  readonly height?: number;
}

export interface IconToken {
  readonly _brand: "IconToken";
  readonly element: ElementType | SvgAsset;
}

export const t = (c: ElementType | SvgAsset): IconToken => ({
  _brand: "IconToken",
  element: c,
});

/** Cart + quantity controls used by storefront ordering UI. */
export const CartIcon = t(_ShoppingCart);
export const CloseIcon = t(_X);
export const MinusIcon = t(_Minus);
export const PlusIcon = t(_Plus);
export const Trash2Icon = t(_Trash2);
