import MenuItemCard from "./MenuItemCard";
import type { CatalogBySlug } from "./MenuOrder";
import type { MenuCategoryData } from "./types";

export default function MenuSection({
  category,
  catalogBySlug,
  locale,
}: {
  category: MenuCategoryData;
  catalogBySlug: CatalogBySlug;
  locale: "en" | "es";
}) {
  const label = locale === "es" && category.labelEs ? category.labelEs : category.label;
  const note = locale === "es" && category.noteEs ? category.noteEs : category.note;

  return (
    <section id={category.id} className="scroll-mt-44 py-10">
      <h2 className="border-b border-cream-deep pb-4 text-2xl font-black tracking-tight text-ink">
        {label}
      </h2>
      {note && <p className="mt-2 text-sm font-medium text-moss">{note}</p>}

      {category.subsections.map((sub) => {
        const subLabel = locale === "es" && sub.labelEs ? sub.labelEs : sub.label;
        const subNote = locale === "es" && sub.noteEs ? sub.noteEs : sub.note;
        return (
          <div key={sub.id} className="mt-6">
            {subLabel && <h3 className="mb-1 text-lg font-bold text-ink">{subLabel}</h3>}
            {subNote && <p className="mb-3 text-xs text-moss">{subNote}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sub.items.map((item) => (
                <MenuItemCard key={item.slug} item={item} catalogBySlug={catalogBySlug} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
