"use client";

import { useState } from "react";

import Image from "next/image";

import { menuCategories, type MenuItem } from "@/features/restaurant/data/menu";

import { LeafIcon } from "./icons";

function formatPrice(item: MenuItem) {
  if (item.priceLabel) return item.priceLabel;
  return `$${item.price?.toFixed(2) ?? ""}`;
}

export default function FullMenu({ showPhotos = true }: { showPhotos?: boolean }) {
  const [active, setActive] = useState(menuCategories[0].id);
  const category = menuCategories.find((c) => c.id === active) ?? menuCategories[0];

  return (
    <section id="menu" className="scroll-mt-20 bg-[#fdf9f0]">
      <div className="px-6 pt-16 pb-20 sm:px-10 sm:pt-20 lg:px-16 lg:pt-24 lg:pb-28 xl:px-24">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.22em] text-navy sm:text-base">THE MENU</p>
          <h2 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            The Full Menu
          </h2>
        </div>

        {/* category tabs — sticky-feeling scroll strip */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-12 flex flex-wrap justify-center gap-2.5 sm:gap-3"
        >
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={cat.id === active}
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors sm:px-7 sm:py-3.5 sm:text-base ${
                cat.id === active ? "bg-navy text-white" : "bg-white text-moss hover:text-navy"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center font-serif text-base text-moss italic sm:text-lg">
          {category.note}
        </p>

        {showPhotos ? (
          /* DoorDash-style item cards — /menu page */
          <ul className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {category.items.map((item, i) => (
              <MenuCard key={`${item.name}-${i}`} item={item} />
            ))}
          </ul>
        ) : (
          /* Editorial menu spread — homepage */
          <ul className="mx-auto mt-14 grid max-w-6xl gap-x-16 gap-y-0 lg:mt-16 lg:grid-cols-2 lg:gap-x-24">
            {category.items.map((item, i) => (
              <MenuRow
                key={`${item.name}-${i}`}
                item={item}
                showStar={category.id !== "signatures"}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const initial = item.name.charAt(0).toUpperCase();

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(32,48,27,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-20px_rgba(32,48,27,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-cream-deep via-cream to-cream-deep">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center">
            <span className="font-serif text-7xl text-navy/25 italic select-none">{initial}</span>
          </div>
        )}

        {item.signature && (
          <span className="absolute top-3 left-3 rounded-full bg-chile px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.18em] text-white uppercase shadow-sm">
            ★ Signature
          </span>
        )}

        {item.veg && (
          <span
            aria-label="Vegetarian"
            title="Vegetarian"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm backdrop-blur-sm"
          >
            <LeafIcon className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-lg leading-tight font-bold text-ink sm:text-xl">
          {item.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-moss">{item.description}</p>
        <p className="mt-4 font-display text-lg font-extrabold text-navy sm:text-xl">
          {formatPrice(item)}
        </p>
      </div>
    </li>
  );
}

/* Editorial menu-row — name … leader … price, italic descriptor below.
   Menu-native typography; used in the no-photo variant on the homepage. */
function MenuRow({ item, showStar }: { item: MenuItem; showStar: boolean }) {
  return (
    <li className="border-b border-ink/10 py-7 last:border-b-0 sm:py-8">
      <div className="flex items-baseline gap-4">
        <h3 className="shrink-0 font-display text-xl leading-tight font-bold text-ink sm:text-2xl">
          {showStar && item.signature && (
            <span aria-label="Signature dish" title="Signature dish" className="mr-2 text-chile">
              ★
            </span>
          )}
          {item.name}
          {item.veg && (
            <LeafIcon
              aria-label="Vegetarian"
              className="ml-2 inline h-4.5 w-4.5 align-[-0.15em] text-navy"
            />
          )}
        </h3>

        <span
          aria-hidden="true"
          className="mb-[0.35em] flex-1 border-b border-dotted border-ink/30"
        />

        <span className="shrink-0 font-display text-lg font-extrabold text-navy sm:text-xl">
          {formatPrice(item)}
        </span>
      </div>
      <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-moss">{item.description}</p>
    </li>
  );
}
