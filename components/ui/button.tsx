import { Children, isValidElement } from "react";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { IconToken } from "../icons";
import type { IconComponentProps } from "../render-icon";
import RenderIcon from "../render-icon";
import { typographyVariants } from "../typography";
import { Spinner } from "./spinner";

type ButtonIconProp = { icon: IconToken } & IconComponentProps;

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        none: "p-0!",
        default: cn(
          typographyVariants({ variant: "text-md", weight: "semibold" }),
          "h-11 gap-2 rounded-md px-4.5 py-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        ),
        xs: "h-9 gap-2 rounded-[min(var(--radius-md),8px)] px-3.5 py-2 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-2 rounded-[min(var(--radius-lg),10px)] px-3 py-2 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 py-3 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-11 rounded-md p-3",
        "icon-xs":
          "size-9 rounded-[min(var(--radius-md),8px)] p-2 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-10 rounded-[min(var(--radius-md),8px)] p-2.5 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12 rounded-md p-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type LegacyButtonProps = {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ButtonIconProp | React.ReactNode;
  rightIcon?: ButtonIconProp | React.ReactNode;
  typography?: VariantProps<typeof typographyVariants>;
};

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  typography,
  children,
  disabled,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & LegacyButtonProps) {
  const typographyClasses = typography
    ? typographyVariants({
        variant: "text-sm",
        weight: "medium",
        ...typography,
      })
    : "";

  const classes = cn(buttonVariants({ variant, size, className }), typographyClasses);

  const isBusy = loading;
  const isDisabled = disabled ?? isBusy;

  let childForAsChild: React.ReactElement | null = null;
  if (asChild && children) {
    const onlyChild = Children.only(children);
    if (isValidElement(onlyChild)) {
      childForAsChild = onlyChild;
    }
  }

  if (childForAsChild) {
    return (
      <ButtonPrimitive
        data-slot="button"
        className={classes}
        render={childForAsChild}
        disabled={isDisabled}
        nativeButton={false}
        {...props}
      />
    );
  }

  const leftIconNode =
    leftIcon && typeof leftIcon === "object" && "icon" in leftIcon ? (
      <span data-icon="inline-start" className="inline-flex shrink-0 items-center">
        <RenderIcon {...leftIcon} />
      </span>
    ) : (
      (leftIcon ?? null)
    );

  const rightIconNode =
    rightIcon && typeof rightIcon === "object" && "icon" in rightIcon ? (
      <span data-icon="inline-end" className="inline-flex shrink-0 items-center">
        <RenderIcon {...rightIcon} />
      </span>
    ) : (
      (rightIcon ?? null)
    );

  return (
    <ButtonPrimitive data-slot="button" className={classes} disabled={isDisabled} {...props}>
      {leftIconNode}
      {isBusy && !leftIconNode ? <Spinner /> : null}
      {children}
      {rightIconNode}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { ButtonIconProp };
