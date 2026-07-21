"use client";

import Image from "next/image";

import { useTranslation } from "@/lib/i18n";

import { Button } from "@/components/ui/button";

import { MenuItemConfigurator } from "@/components/menu-item-configurator";

import { useCartStore } from "@/src/store/cart.ts";

import type { CatalogBySlug } from "./MenuOrder";
import { canAddToCart } from "./to-orderable-item";
import type { MenuItem } from "./types";

function formatPrice(item: MenuItem) {
  if (item.priceLabel) return item.priceLabel;
  if (item.price !== null && item.price !== undefined) return `$${item.price.toFixed(2)}`;
  return null;
}

function slugToId(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = Math.trunc(hash * 31 + (slug.codePointAt(i) ?? 0)) % 2_147_483_647;
  }
  return Math.abs(hash);
}

function StaticAddToCart({ item }: { item: MenuItem & { price: number } }) {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useTranslation();

  function handleAdd() {
    addItem(
      {
        id: slugToId(item.slug),
        name: item.name,
        basePrice: Math.round(item.price * 100),
        category: "Daily Specials",
        categoryId: 0,
        availabilityType: "steamTable",
      },
      [],
      1,
    );
  }

  return (
    <Button size="sm" onClick={handleAdd} aria-label={`${t("menu.add")} ${item.name}`}>
      + {t("menu.add")}
    </Button>
  );
}

export default function MenuItemCard({
  item,
  catalogBySlug,
}: {
  item: MenuItem;
  catalogBySlug: CatalogBySlug;
}) {
  const { locale } = useTranslation();
  const price = formatPrice(item);
  const cmsItem = catalogBySlug[item.slug] ?? null;
  const description = locale === "es" && item.descriptionEs ? item.descriptionEs : item.description;

  return (
    <article className="flex items-start gap-4 rounded-xl border border-cream-deep bg-white p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="text-base leading-snug font-bold text-ink">{item.name}</h4>
        {description && (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-moss">{description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          {price && <p className="text-sm font-bold text-ink">{price}</p>}
          {cmsItem ? (
            <MenuItemConfigurator item={cmsItem} />
          ) : canAddToCart(item) ? (
            <StaticAddToCart item={item} />
          ) : null}
        </div>
      </div>
      {item.image && (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream-deep">
          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
        </div>
      )}
    </article>
  );
}
