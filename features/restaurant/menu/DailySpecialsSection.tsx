"use client";

import { useEffect, useState } from "react";

import { DAILY_SPECIALS_ID, dailySpecialsDays, dailySpecialsNote } from "./data";
import MenuItemCard from "./MenuItemCard";

// Day chips filter the grid; defaults to today (set after mount so the server
// and client render the same initial markup).
export default function DailySpecialsSection() {
  const [activeDay, setActiveDay] = useState(dailySpecialsDays[1].id); // monday

  useEffect(() => {
    const today = dailySpecialsDays[new Date().getDay()];
    if (today) setActiveDay(today.id);
  }, []);

  const day = dailySpecialsDays.find((d) => d.id === activeDay) ?? dailySpecialsDays[1];

  return (
    <section id={DAILY_SPECIALS_ID} className="scroll-mt-44 py-10">
      <h2 className="text-center text-4xl font-black tracking-tight text-ink">
        Daily Specials / Especiales Diarios
      </h2>
      <p className="mt-2 text-center text-sm font-medium text-moss">{dailySpecialsNote}</p>

      <div
        role="tablist"
        aria-label="Day of the week"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
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
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                active ? "bg-pine text-white" : "bg-white text-moss hover:bg-sage hover:text-ink"
              }`}
            >
              {spanish}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-2xl font-bold text-ink">{day.label}</p>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {day.items.map((item) => (
          <MenuItemCard key={item.slug} item={item} categoryId={DAILY_SPECIALS_ID} />
        ))}
      </div>
    </section>
  );
}
