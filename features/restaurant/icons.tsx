import type { SVGProps } from "react";

type IconProps = {
  className?: string;
};

type LogoProps = {
  dark?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

export function Logo({ dark = false, size = "md" }: LogoProps) {
  const sizes: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "h-14 w-auto sm:h-16",
    md: "h-16 w-auto sm:h-18",
    lg: "h-18 w-auto sm:h-20",
    xl: "h-20 w-auto sm:h-24",
  };
  const title = sizes[size] ?? sizes.md;
  return (
    <img
      src="/logo.png"
      alt="El Quetzalito"
      className={`${title} block object-contain leading-none`}
      style={dark ? { filter: "none" } : undefined}
    />
  );
}

const stroke: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.2}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function BagIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 8h14l-1 12.5H6L5 8Z" />
      <path d="M9 10V6.5C9 4.6 10.3 3 12 3s3 1.6 3 3.5V10" />
    </svg>
  );
}

/* hand-drawn lime wedge + sparks for the promo banner */
export function LimeDoodle({ className = "h-20 w-20" }: IconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <path d="M14 46a26 26 0 0 0 44-18L14 46Z" fill="#d9e8a3" stroke="#f4fadf" strokeWidth="3" />
      <path d="M20 45a19 19 0 0 0 31-13L20 45Z" fill="#b5d36a" />
      <path d="M24 44l26-11M28 47l22-9" stroke="#f4fadf" strokeWidth="1.5" />
      <path
        d="M62 18l3-7M68 26l7-3M66 12l5-5"
        stroke="var(--color-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
