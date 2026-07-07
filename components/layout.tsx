import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import {
  gapClasses,
  gapXClasses,
  gapYClasses,
  paddingClasses,
  paddingXClasses,
  paddingYClasses,
  radiusClasses,
} from "@/lib/tokens";
import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      muted: "bg-muted text-muted-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      inverted: "bg-foreground text-background",
      primary: "bg-primary text-primary-foreground",
    },
    spacing: {
      ...paddingYClasses,
    },
  },
  defaultVariants: {
    spacing: "0",
  },
});

interface SectionProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sectionVariants> {
  as?: React.ElementType;
}

export function Section({
  className,
  variant,
  as: Comp = "section",
  spacing,
  ...props
}: SectionProps) {
  return <Comp className={cn(sectionVariants({ variant, spacing }), className)} {...props} />;
}

const containerVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-3xl",
      lg: "max-w-5xl",
      xl: "max-w-7xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    },
    align: {
      left: "mx-0",
      center: "mx-auto",
      right: "mr-0 ml-auto",
    },
    spacing: {
      ...paddingXClasses,
    },
  },
  defaultVariants: {
    spacing: "0",
    size: "xl",
    align: "center",
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

export function Container({ className, size, align, spacing, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size, align, spacing }), className)} {...props} />;
}

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: { ...gapClasses },
  },
  defaultVariants: {
    gap: "2.5",
    direction: "col",
    wrap: false,
    justify: "start",
    align: "center",
  },
});

interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {
  as?: React.ElementType;
}

export function Flex({
  className,
  direction,
  gap,
  wrap,
  align,
  justify,
  as: Comp = "div",
  ...props
}: FlexProps) {
  return (
    <Comp
      className={cn(flexVariants({ direction, gap, wrap, align, justify }), className)}
      {...props}
    />
  );
}

export function Stack({ className, ...props }: Omit<FlexProps, "direction">) {
  return <Flex direction="col" className={className} {...props} />;
}

export function Cluster({ className, ...props }: Omit<FlexProps, "direction">) {
  return <Flex direction="row" className={className} {...props} />;
}

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  grow?: boolean;
}

export function Spacer({ grow = true, className, ...props }: SpacerProps) {
  return <div className={cn(grow ? "grow" : "", className)} aria-hidden="true" {...props} />;
}

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    },
    gap: { ...gapClasses },
    gapX: { ...gapXClasses },
    gapY: { ...gapYClasses },
  },
  defaultVariants: {
    cols: 3,
  },
});

interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  height?: string;
  width?: string;
}

export function Grid({ className, cols, gap, gapX, gapY, height, width, ...props }: GridProps) {
  const gridStyles = {
    ...(height && { height }),
    ...(width && { width }),
  };

  return (
    <div
      className={cn(gridVariants({ cols, gap, gapX, gapY }), className)}
      style={Object.keys(gridStyles).length > 0 ? gridStyles : undefined}
      {...props}
    />
  );
}

const boxVariants = cva("", {
  variants: {
    p: { ...paddingClasses },
    py: { ...paddingYClasses },
    px: { ...paddingXClasses },
    radius: { ...radiusClasses },
    gap: { ...gapClasses },
    bg: {
      none: "",
      muted: "bg-muted",
      white: "bg-white",
      card: "bg-card",
      primary: "bg-primary",
      secondary: "bg-secondary",
    },
  },
  defaultVariants: {
    bg: "none",
  },
});

interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {
  as?: React.ElementType;
}

export function Box({
  className,
  as: Comp = "div",
  p,
  px,
  py,
  bg,
  gap,
  radius,
  ...props
}: BoxProps) {
  return <Comp className={cn(boxVariants({ p, px, py, radius, bg, gap }), className)} {...props} />;
}
