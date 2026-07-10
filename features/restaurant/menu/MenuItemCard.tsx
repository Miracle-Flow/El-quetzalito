"use client";

import { useState } from "react";

import Image from "next/image";

import { MENU_IMAGE_EXTENSIONS, menuImageBase, type MenuItem } from "./types";

function formatPrice(item: MenuItem) {
  if (item.priceLabel) return item.priceLabel;
  if (item.price !== null) return `$${item.price.toFixed(2)}`;
  return null;
}

// Tries public/menu/<category>/<slug>.jpg → .webp → .png. When every
// extension 404s the image block collapses and the card is text-only.
function CardImage({ base, alt }: { base: string; alt: string }) {
  const [extIndex, setExtIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  if (extIndex >= MENU_IMAGE_EXTENSIONS.length) return null;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-peach">
      <Image
        src={`${base}.${MENU_IMAGE_EXTENSIONS[extIndex]}`}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setExtIndex((i) => i + 1)}
      />
    </div>
  );
}

export default function MenuItemCard({ item, categoryId }: { item: MenuItem; categoryId: string }) {
  const price = formatPrice(item);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-cream-deep bg-white shadow-[0_2px_10px_-4px_rgba(32,48,27,0.12)] transition-shadow hover:shadow-[0_10px_28px_-10px_rgba(32,48,27,0.28)]">
      <CardImage base={menuImageBase(categoryId, item.slug)} alt={item.name} />
      <div className="flex grow flex-col gap-1.5 p-5">
        <h4 className="text-lg leading-snug font-bold text-ink">{item.name}</h4>
        {item.description && (
          <p className="text-sm leading-relaxed text-moss">{item.description}</p>
        )}
        {price && <p className="mt-auto pt-3 text-base font-bold text-ink">{price}</p>}
      </div>
    </article>
  );
}
