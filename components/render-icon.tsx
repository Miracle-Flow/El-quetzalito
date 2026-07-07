"use client";

import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import type { IconToken, SvgAsset } from "./icons";

export interface IconComponentProps {
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
  fill?: boolean;
}

interface RenderIconProps extends HTMLAttributes<HTMLElement>, IconComponentProps {
  icon: IconToken;
}

type IconElement = ElementType | SvgAsset;

interface RenderIconOptions extends IconComponentProps {
  iconClassName: string;
}

function isSvgAsset(icon: IconElement): icon is SvgAsset {
  return typeof icon === "object" && icon !== null && "src" in icon;
}

function renderSvgIcon(
  Icon: ElementType,
  { size, iconClassName, strokeWidth, fill, ...rest }: RenderIconOptions & Record<string, unknown>,
) {
  return (
    <Icon
      size={size}
      width={size}
      height={size}
      className={iconClassName}
      {...(fill ? { fill: "currentColor" } : {})}
      {...(strokeWidth === undefined ? {} : { strokeWidth })}
      {...rest}
    />
  );
}

/**
 * Renders an external `.svg` file as a CSS mask so that `currentColor` (set via
 * text-color utilities like `text-primary` / `text-white`) recolors the glyph.
 *
 * Single-color only — every visible pixel is painted with `currentColor`. For
 * multi-color SVGs, register a `t(Component)` token with the SVG markup as a
 * React component instead of using the `SvgAsset` (`{ src }`) form.
 */
function renderSvgAsset(
  asset: SvgAsset,
  {
    size,
    iconClassName,
    strokeWidth: _strokeWidth,
    fill: _fill,
    ...rest
  }: RenderIconOptions & Record<string, unknown>,
) {
  const numericSize = typeof size === "number" ? size : 24;

  return (
    <span
      aria-hidden="true"
      className={iconClassName}
      style={{
        display: "inline-block",
        width: numericSize,
        height: numericSize,
        backgroundColor: "currentColor",
        maskImage: `url(${asset.src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${asset.src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      {...rest}
    />
  );
}

export function RenderIcon({
  icon,
  size = 24,
  className,
  strokeWidth,
  fill,
  ...rest
}: RenderIconProps) {
  const iconElement = icon.element;
  const iconClassName = cn("shrink-0", className);
  const options = { size, iconClassName, strokeWidth, fill, ...rest };

  if (isSvgAsset(iconElement)) {
    return renderSvgAsset(iconElement, options);
  }

  const Icon = iconElement;

  return renderSvgIcon(Icon, options);
}

export default RenderIcon;
