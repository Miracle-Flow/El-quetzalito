"use client";

import type { ElementType } from "react";

import {
  AlertTriangle as _AlertTriangle,
  Calendar as _Calendar,
  Check as _Check,
  Clock as _Clock,
  Heart as _Heart,
  Mail as _Mail,
  Minus as _Minus,
  Phone as _Phone,
  Plus as _Plus,
  HelpCircle as _Question,
  ShoppingCart as _ShoppingCart,
  Sparkles as _Sparkles,
  Trash2 as _Trash2,
  User as _User,
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

/** Checkout form icons. */
export const CalendarIcon = t(_Calendar);
export const ClockIcon = t(_Clock);
export const HeartIcon = t(_Heart);
export const SparklesIcon = t(_Sparkles);
export const EnvelopeIcon = t(_Mail);
export const PhoneIcon = t(_Phone);
export const UserIcon = t(_User);

/** Checkout result page icons. */
export const AlertTriangle = t(_AlertTriangle);
export const CheckIcon = t(_Check);
export const Question = t(_Question);
