/* Stylized quetzal: green body, red chest, long tail feathers */
export function QuetzalMark({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* tail feathers */}
      <path
        d="M26 27c-2 7-7 12-14 17"
        fill="none"
        stroke="var(--color-pine)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M29 28c-.5 8-4 13-8 18"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* body */}
      <path
        d="M15 13c-3 6-1 16 9 16 8 0 11-6 8-13-2.5-6-13-9-17-3Z"
        fill="var(--color-brand)"
      />
      {/* red chest */}
      <path
        d="M15.5 17c-1.5 5 1.5 11 8 11.8-4.5-3-5.5-8-4-12.8l-4 1Z"
        fill="var(--color-chile)"
      />
      {/* head */}
      <circle cx="18" cy="10" r="6.5" fill="var(--color-pine)" />
      {/* crest */}
      <path
        d="M14 5.5c1.5-2 5-2.5 7-1"
        fill="none"
        stroke="var(--color-pine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* beak */}
      <path d="M12 8.5 7.5 10.5 12.5 12.5Z" fill="var(--color-marigold)" />
      {/* eye */}
      <circle cx="16.5" cy="9" r="1.4" fill="#fff" />
    </svg>
  );
}

export function Logo({ dark = false, size = "md" }) {
  const sizes = {
    md: "text-3xl",
    lg: "text-4xl sm:text-5xl",
    xl: "text-5xl sm:text-6xl",
  };
  const title = sizes[size] ?? sizes.md;
  return (
    <span
      className={`font-script ${title} leading-none ${
        dark ? "text-cream" : "text-ink"
      }`}
      style={{ fontFamily: "var(--font-script)" }}
    >
      El Quetzalito
    </span>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LeafIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M6 15C6 9 10 5 19 5c0 9-4 13-10 13-1.5 0-3-.5-3-3Z" />
      <path d="M5 19c3-4 6-7 10-9" />
    </svg>
  );
}

export function FlameIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 21c-4 0-6.5-2.6-6.5-6 0-3 2-5 3.5-7.5 1 1.5 1.5 2 2.5 3C12 8 12.5 5.5 14 3c2.5 3.5 4.5 6.7 4.5 10 0 5-3 8-6.5 8Z" />
      <path d="M12 21c-1.8 0-3-1.4-3-3.2 0-1.6 1.2-2.8 3-4.8 1.8 2 3 3.2 3 4.8 0 1.8-1.2 3.2-3 3.2Z" />
    </svg>
  );
}

export function ChiliIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M14 7c1 8-4 13-10 14 8 3 16-3 16-11" />
      <path d="M14 7c0-2 1.5-3.5 4-3.5" />
      <path d="M14 7c2-1.5 4.5-1 6 3l-4 1" />
    </svg>
  );
}

export function ClockIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function HeartIcon({ className = "h-6 w-6", filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...(filled ? { fill: "currentColor" } : stroke)}
    >
      <path d="M12 20.5C7 16.5 3.5 13.4 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.8-3.5 6.9-8.5 10.9Z" />
    </svg>
  );
}

export function StarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.2}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function BagIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5 8h14l-1 12.5H6L5 8Z" />
      <path d="M9 10V6.5C9 4.6 10.3 3 12 3s3 1.6 3 3.5V10" />
    </svg>
  );
}

/* line icons for the three menu category cards */
export function TacoIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...stroke}>
      <path d="M4 22a12 12 0 0 1 24 0Z" />
      <path d="M8 22c1.3-1.5 2.7-1.5 4 0s2.7 1.5 4 0 2.7-1.5 4 0 2.7 1.5 4 0" />
      <path d="M11 14c1-1.5 3-2.5 5-2.5" />
    </svg>
  );
}

export function BurritoIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...stroke}>
      <rect x="4" y="10" width="24" height="12" rx="6" transform="rotate(-8 16 16)" />
      <path d="M8.5 12.5c2 .8 3.5 2.5 4 5M25 11.5c-.8 2-.8 4.5 0 7" />
    </svg>
  );
}

export function NachoIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" {...stroke}>
      <path d="M16 5 27 25H5L16 5Z" />
      <path d="M12 25 8.5 18.5M20 25l3.5-6.5" />
      <circle cx="16" cy="14" r="0.5" fill="currentColor" />
      <circle cx="13.5" cy="20" r="0.5" fill="currentColor" />
      <circle cx="18.5" cy="20" r="0.5" fill="currentColor" />
    </svg>
  );
}

/* hand-drawn lime wedge + sparks for the promo banner */
export function LimeDoodle({ className = "h-20 w-20" }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <path
        d="M14 46a26 26 0 0 0 44-18L14 46Z"
        fill="#d9e8a3"
        stroke="#f4fadf"
        strokeWidth="3"
      />
      <path
        d="M20 45a19 19 0 0 0 31-13L20 45Z"
        fill="#b5d36a"
      />
      <path d="M24 44l26-11M28 47l22-9" stroke="#f4fadf" strokeWidth="1.5" />
      <path
        d="M62 18l3-7M68 26l7-3M66 12l5-5"
        stroke="var(--color-marigold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SocialIcon({ type, className = "h-4.5 w-4.5" }) {
  const paths = {
    facebook: "M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.6-.1-1.4-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4V11H7.8v3h2.4v7h3.3Z",
    instagram:
      "M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4Zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6ZM16.9 8a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM12 4.5c-2 0-2.3 0-3.1.1a5.6 5.6 0 0 0-1.9.3 3.9 3.9 0 0 0-2.2 2.2c-.2.6-.3 1.2-.3 1.9-.1.8-.1 1-.1 3s0 2.3.1 3.1c0 .7.1 1.3.3 1.9a3.9 3.9 0 0 0 2.2 2.2c.6.2 1.2.3 1.9.3.8.1 1 .1 3.1.1s2.3 0 3.1-.1c.7 0 1.3-.1 1.9-.3a3.9 3.9 0 0 0 2.2-2.2c.2-.6.3-1.2.3-1.9.1-.8.1-1 .1-3.1s0-2.3-.1-3.1c0-.7-.1-1.3-.3-1.9a3.9 3.9 0 0 0-2.2-2.2 5.6 5.6 0 0 0-1.9-.3c-.8-.1-1-.1-3.1-.1Zm0 1.3c2 0 2.2 0 3 .1.6 0 1 .1 1.4.3.5.2.9.6 1.1 1.1.2.4.3.8.3 1.4 0 .8.1 1 .1 3s0 2.2-.1 3c0 .6-.1 1-.3 1.4a2.5 2.5 0 0 1-1.1 1.1c-.4.2-.8.3-1.4.3-.8.1-1 .1-3 .1s-2.2 0-3-.1c-.6 0-1-.1-1.4-.3a2.5 2.5 0 0 1-1.1-1.1 4.2 4.2 0 0 1-.3-1.4c-.1-.8-.1-1-.1-3s0-2.2.1-3c0-.6.1-1 .3-1.4.2-.5.6-.9 1.1-1.1.4-.2.8-.3 1.4-.3.8-.1 1-.1 3-.1Z",
    x: "M17.2 4h2.7l-5.9 6.8L21 21h-5.4l-4.3-5.6L6.4 21H3.7l6.3-7.2L3.4 4h5.6l3.9 5.1L17.2 4Zm-1 15.4h1.5L8.2 5.5H6.6l9.6 13.9Z",
  };
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  );
}
