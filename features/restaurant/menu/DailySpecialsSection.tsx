"use client";

import { useEffect, useState } from "react";

import { DAILY_SPECIALS_ID, dailySpecialsDays, dailySpecialsNote } from "./data";
import MenuItemCard from "./MenuItemCard";
import type { CatalogBySlug } from "./MenuOrder";

export default function DailySpecialsSection({ catalogBySlug }: { catalogBySlug: CatalogBySlug }) {
  const [activeDay, setActiveDay] = useState(dailySpecialsDays[1].id);

  useEffect(() => {
    const today = dailySpecialsDays[new Date().getDay()];
    if (today) setActiveDay(today.id);
  }, []);

  const day = dailySpecialsDays.find((d) => d.id === activeDay) ?? dailySpecialsDays[1];

  return (
    <section id={DAILY_SPECIALS_ID} className="scroll-mt-44 py-10">
      <h2 className="border-b border-cream-deep pb-4 text-2xl font-black tracking-tight text-ink">
        Daily Specials / Especiales Diarios
      </h2>
      <p className="mt-2 text-sm font-medium text-moss">{dailySpecialsNote}</p>

      <div role="tablist" aria-label="Day of the week" className="mt-5 flex flex-wrap gap-2">
        {dailySpecialsDays.map((d) => {
          const active = d.id === activeDay;
          const [spanish] = d.label.split(" / ");
          return (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDay(d.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                active
                  ? "bg-navy text-white"
                  : "bg-white text-moss hover:bg-cream-deep hover:text-navy"
              }`}
            >
              {spanish}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-lg font-bold text-ink">{day.label}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {day.items.map((item) => (
          <MenuItemCard
            key={item.slug}
            item={item}
            category={{ id: DAILY_SPECIALS_ID, label: "Daily Specials" }}
            catalogBySlug={catalogBySlug}
          />
        ))}
      </div>
    </section>
  );
}
