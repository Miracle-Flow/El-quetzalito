import React from "react";

import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  defaultVariants: {
    align: "left",
    variant: "text-md",
    weight: "regular",
    transform: "normal",
  },

  variants: {
    align: {
      center: "text-center",
      justify: "text-justify",
      left: "text-left",
      right: "text-right",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      normal: "normal-case",
    },
    textColor: {
      foreground: "text-foreground",
      background: "text-background",
      primary: "text-primary",
      sidebar: "text-sidebar-accent-foreground",
      muted: "text-muted-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      inherit: "text-inherit",
      popover: "text-popover-foreground",
    },

    variant: {
      h1: "text-7xl leading-22.5 tracking-tight",
      h2: "text-6xl leading-18 tracking-tight",
      h3: "text-5xl leading-15 tracking-tight",
      h4: "text-4xl leading-11 tracking-tight",
      h5: "text-3xl leading-9.5 tracking-tight",
      h6: "text-2xl leading-8 tracking-tight",
      "text-xl": "text-xl leading-7.5",
      "text-lg": "text-lg leading-7",
      "text-md": "text-base leading-6",
      "text-sm": "text-sm leading-5",
      "text-xs": "text-xs leading-4.5",
    },

    weight: {
      bold: "font-bold",
      medium: "font-medium",
      regular: "font-normal",
      semibold: "font-semibold",
    },
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  render?: React.ReactElement;
  as?: React.ElementType;
}

function Typography({
  className,
  variant,
  textColor,
  transform,
  align,
  weight,
  render,
  as,
  ...props
}: TypographyProps) {
  const variantElementMap: Record<NonNullable<TypographyProps["variant"]>, React.ElementType> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h2",
    h5: "h5",
    h6: "h6",
    "text-xl": "p",
    "text-lg": "p",
    "text-md": "p",
    "text-sm": "p",
    "text-xs": "p",
  };

  const resolvedVariant = variant ?? "text-md";
  const Element = as ?? variantElementMap[resolvedVariant];
  const defaultElement = React.createElement(Element);

  return useRender({
    props: {
      className: cn(
        typographyVariants({ align, textColor, variant, weight, transform }),
        className,
      ),
      ...props,
    },
    render: render ?? defaultElement,
  });
}

export { Typography, typographyVariants };
