import MenuItemCard from "./MenuItemCard";
import type { CatalogBySlug } from "./MenuOrder";
import type { MenuCategoryData } from "./types";

export default function MenuSection({
  category,
  catalogBySlug,
}: {
  category: MenuCategoryData;
  catalogBySlug: CatalogBySlug;
}) {
  return (
    <section id={category.id} className="scroll-mt-44 py-10">
      <h2 className="border-b border-cream-deep pb-4 text-2xl font-black tracking-tight text-ink">
        {category.label}
      </h2>
      {category.note && <p className="mt-2 text-sm font-medium text-moss">{category.note}</p>}

      {category.subsections.map((sub) => (
        <div key={sub.id} className="mt-6">
          {sub.label && <h3 className="mb-1 text-lg font-bold text-ink">{sub.label}</h3>}
          {sub.note && <p className="mb-3 text-xs text-moss">{sub.note}</p>}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sub.items.map((item) => (
              <MenuItemCard
                key={item.slug}
                item={item}
                category={{ id: category.id, label: category.label }}
                catalogBySlug={catalogBySlug}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
