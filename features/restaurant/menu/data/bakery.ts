import type { MenuCategoryData } from "../types";

export const bakery: MenuCategoryData = {
  id: "bakery",
  label: "Panadería / Bakery",
  note: "Freshly baked Guatemalan breads and pastries.",
  subsections: [
    {
      id: "pan",
      items: [
        {
          slug: "pan-de-anis",
          name: "Pan de Anís",
          description: "Traditional anise-flavored bread roll.",
          price: 2.5,
          image: "/Menu/Pan de Anís.avif",
        },
        {
          slug: "cuernitos",
          name: "Cuernitos",
          description: "Buttery crescent-shaped bread.",
          price: 2.5,
          image: "/Menu/Cuernitos.avif",
        },
        {
          slug: "cubilete",
          name: "Cubilete",
          description: "Sweet Guatemalan pastry cup.",
          price: 3,
          image: "/Menu/Cubilete.avif",
        },
        {
          slug: "somanteca",
          name: "Somanteca",
          description: "Traditional lard bread.",
          price: 2.5,
          image: "/Menu/Somanteca.avif",
        },
        {
          slug: "cortado",
          name: "Cortado",
          description: "Traditional Guatemalan sweet bread.",
          price: 3,
          image: "/Menu/Cortado.avif",
        },
        {
          slug: "milhojas",
          name: "Milhojas",
          description: "Layered flaky pastry with cream.",
          price: 3.5,
          image: "/Menu/Milhojas.avif",
        },
        {
          slug: "cachito",
          name: "Cachito",
          description: "Sweet horn-shaped bread roll.",
          price: 2.5,
          image: "/Menu/Cachito.avif",
        },
        {
          slug: "pan-comania",
          name: "Pan Comania",
          description: "Traditional Guatemalan sweet bread.",
          price: 2.5,
          image: "/Menu/Pan Comania.avif",
        },
      ],
    },
  ],
};
