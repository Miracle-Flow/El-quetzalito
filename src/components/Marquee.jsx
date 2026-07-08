const items = [
  "Handmade tortillas",
  "Slow-braised birria",
  "Salsas from scratch",
  "Fired to order",
  "Pickup & delivery",
  "Cocina Mexicana",
];

function HuipilStrap({ patternId }) {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="24"
      style={{ display: "block" }}
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="60"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <rect width="60" height="24" fill="#1A3060" />
          <rect width="60" height="3" fill="#D4A017" />
          <rect y="21" width="60" height="3" fill="#D4A017" />
          <polygon points="30,4 50,12 30,20 10,12" fill="#C8420A" />
          <polygon
            points="30,8 46,12 30,16 14,12"
            fill="none"
            stroke="#D4A017"
            strokeWidth="1.2"
          />
          <polygon points="0,3 8,3 0,11" fill="#2E7D32" />
          <polygon points="60,3 52,3 60,11" fill="#2E7D32" />
          <polygon points="0,21 8,21 0,13" fill="#2E7D32" />
          <polygon points="60,21 52,21 60,13" fill="#2E7D32" />
          <circle cx="30" cy="3.5" r="1.4" fill="#D4A017" />
          <circle cx="30" cy="20.5" r="1.4" fill="#D4A017" />
        </pattern>
      </defs>
      <rect width="100%" height="24" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default function Marquee() {
  const loop = [...items, ...items];

  return (
    <section
      aria-label="What we're about"
      className="relative overflow-hidden bg-[#142340] text-cream"
    >
      <HuipilStrap patternId="marquee-huipil-top" />
      <div className="que-marquee flex whitespace-nowrap py-5 sm:py-6">
        {loop.map((text, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
            aria-hidden={i >= items.length ? "true" : undefined}
          >
            <span className="font-serif italic text-2xl sm:text-3xl lg:text-4xl leading-none tracking-[0.01em]">
              {text}
            </span>
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-cream/60" />
          </div>
        ))}
      </div>
      <HuipilStrap patternId="marquee-huipil-bot" />
    </section>
  );
}
