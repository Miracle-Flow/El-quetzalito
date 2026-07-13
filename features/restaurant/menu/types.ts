export type MenuItem = {
  slug: string;
  name: string;
  description?: string;
  descriptionEs?: string;
  price?: number;
  /** Free-form price text ("SM $2.50 · LG $3.00"). Wins over `price`. */
  priceLabel?: string;
  /** Absolute path to image in /public, e.g. "/Menu/Carne Asada.avif". */
  image?: string;
};

export type MenuSubsection = {
  id: string;
  label?: string;
  labelEs?: string;
  note?: string;
  noteEs?: string;
  items: MenuItem[];
};

export type MenuCategoryData = {
  id: string;
  label: string;
  labelEs?: string;
  note?: string;
  noteEs?: string;
  subsections: MenuSubsection[];
};
