"use client";

import { useEffect, useRef, useState } from "react";

export type MenuTab = { id: string; label: string };

// Kurobuta-style sticky category bar: horizontal, scrollable on mobile,
// active tab bold with an underline. Clicking scrolls to the section;
// scrolling updates the active tab via IntersectionObserver.
export default function MenuTabs({ tabs }: { tabs: MenuTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  // Suppresses observer updates while a click-triggered smooth scroll runs.
  const clickScrollUntil = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickScrollUntil.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Active = section crossing a band just below the sticky bars.
      { rootMargin: "-35% 0px -60% 0px" },
    );
    tabs.forEach((tab) => {
      const el = document.querySelector(`#${tab.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tabs]);

  const goTo = (id: string) => {
    setActive(id);
    clickScrollUntil.current = Date.now() + 800;
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sticky top-24 z-40 border-b border-cream-deep bg-white/95 shadow-[0_6px_16px_-12px_rgba(32,48,27,0.25)] backdrop-blur">
      <nav
        aria-label="Menu categories"
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 sm:gap-6 sm:px-6"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => goTo(tab.id)}
              aria-current={isActive ? "true" : undefined}
              className={`border-b-[3px] px-1 py-4 text-sm font-bold whitespace-nowrap transition-colors sm:text-base ${
                isActive ? "border-pine text-ink" : "border-transparent text-moss hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
