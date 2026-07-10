// Shared types for the order-style menu (app/(marketing)/menu).
//
// Every item has a `slug` that doubles as its image filename. Images live in
// `public/menu/<categoryId>/<slug>.<ext>` — see MENU-IMAGES.md at the repo
// root. When no image file exists, the card renders text-only.

export type MenuItem = {
  /** Image filename (without extension) inside `public/menu/<categoryId>/`. */
  slug: string;
  /** Dish name, Spanish-first. */
  name: string;
  /** English description / included sides. */
  description?: string;
  price?: number;
  /** Free-form price text ("SM $2.50 · LG $3.00"). Wins over `price`. */
  priceLabel?: string;
};

export type MenuSubsection = {
  id: string;
  /** Omitted for categories with a single unlabeled group. */
  label?: string;
  note?: string;
  items: MenuItem[];
};

export type MenuCategoryData = {
  /** Section anchor + image folder name under `public/menu/`. */
  id: string;
  /** Tab label and section heading. */
  label: string;
  note?: string;
  subsections: MenuSubsection[];
};

/** Extensions tried in order when loading `public/menu/<category>/<slug>`. */
export const MENU_IMAGE_EXTENSIONS = ["jpg", "webp", "png"] as const;

export function menuImageBase(categoryId: string, slug: string) {
  return `/menu/${categoryId}/${slug}`;
}
