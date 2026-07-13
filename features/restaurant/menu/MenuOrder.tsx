"use client";

import { useTranslation } from "@/lib/i18n";

import type { MenuItem } from "@/payload-types";

import DailySpecialsSection from "./DailySpecialsSection";
import { DAILY_SPECIALS_ID, menuCategories } from "./data";
import MenuSection from "./MenuSection";
import MenuTabs from "./MenuTabs";

export type CatalogBySlug = Record<string, MenuItem>;

export default function MenuOrder({ catalogBySlug }: { catalogBySlug: CatalogBySlug }) {
  const { locale, t } = useTranslation();

  const tabs = [
    { id: DAILY_SPECIALS_ID, label: t("menuPage.dailySpecials") },
    ...menuCategories.map((category) => ({
      id: category.id,
      label: locale === "es" && category.labelEs ? category.labelEs : category.label,
    })),
  ];

  return (
    <div className="bg-cream pt-24">
      <header className="px-6 pt-12 pb-10 text-center">
        <p className="text-brand text-sm font-bold tracking-[0.2em] uppercase">
          {t("menuPage.eyebrow")}
        </p>
        <h1 className="mt-2 text-5xl font-black tracking-tight text-ink">
          {t("menuPage.heading")}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-moss">{t("menuPage.body")}</p>
      </header>

      <MenuTabs tabs={tabs} />

      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <DailySpecialsSection catalogBySlug={catalogBySlug} />
        {menuCategories.map((category) => (
          <MenuSection
            key={category.id}
            category={category}
            catalogBySlug={catalogBySlug}
            locale={locale}
          />
        ))}
      </main>
    </div>
  );
}
