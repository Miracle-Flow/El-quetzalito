import MenuItemCard from "./MenuItemCard";
import type { MenuCategoryData } from "./types";

// One tab target: centered category heading, optional note, then a card grid
// per subsection (subsection headings only render when labeled).
export default function MenuSection({ category }: { category: MenuCategoryData }) {
  return (
    <section id={category.id} className="scroll-mt-44 py-10">
      <h2 className="text-center text-4xl font-black tracking-tight text-ink">{category.label}</h2>
      {category.note && (
        <p className="mt-2 text-center text-sm font-medium text-moss">{category.note}</p>
      )}

      {category.subsections.map((sub) => (
        <div key={sub.id} className="mt-10">
          {sub.label && <h3 className="text-2xl font-bold text-ink">{sub.label}</h3>}
          {sub.note && <p className="mt-1 text-sm text-moss">{sub.note}</p>}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sub.items.map((item) => (
              <MenuItemCard key={item.slug} item={item} categoryId={category.id} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
