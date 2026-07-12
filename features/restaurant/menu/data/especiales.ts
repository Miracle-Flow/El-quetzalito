import type { MenuCategoryData } from "../types";

export const especiales: MenuCategoryData = {
  id: "especiales",
  label: "Especiales / Special Platters",
  note: "All plates are served with corn tortilla.",
  subsections: [
    {
      id: "carnes",
      label: "Carnes / Meats",
      items: [
        {
          slug: "parrillada-chapina",
          name: "Parrillada Chapina",
          description:
            "Grilled marinated pork, grilled meat, chorizo, longaniza, guacamole, onions, pico de gallo and salad, served with rice and beans.",
          price: 22,
        },
        {
          slug: "churrasco-tikal",
          name: "Churrasco Tikal",
          description: "Grilled meat, chorizo, sausage, onions, rice and beans.",
          price: 20,
          image: "/Menu/Churrasco_Tikal.avif",
        },
        {
          slug: "churrasco-mixto",
          name: "Churrasco Mixto",
          description:
            "Grilled marinated pork, chorizo, longaniza, rice, beans, onions and pasta salad.",
          price: 20,
        },
        {
          slug: "carne-asada",
          name: "Carne Asada",
          description: "Grilled meat served with rice, beans and salad.",
          price: 15,
          image: "/Menu/Carne Asada.avif",
        },
        {
          slug: "carnitas-de-cerdo-fritas",
          name: "Carnitas de Cerdo Fritas",
          description: "Fried pork served with rice, beans, salad and tortillas.",
          price: 15,
        },
        {
          slug: "costillas-bbq",
          name: "Costillas BBQ",
          description: "BBQ pork ribs served with rice, beans and salad.",
          price: 18,
          image: "/Menu/Costillas BBQ.avif",
        },
        {
          slug: "alitas-bbq",
          name: "Alitas BBQ",
          description: "BBQ chicken wings served with rice, beans and salad.",
          price: 14,
          image: "/Menu/Alitas BBQ.avif",
        },
        {
          slug: "pepian-de-gallina-o-res",
          name: "Pepián de Gallina o Res",
          description:
            "Traditional Guatemalan pepian sauce with chicken or beef, rice and avocado.",
          price: 14,
          image: "/Menu/Pepián de Gallina o Res.avif",
        },
      ],
    },
    {
      id: "pollo",
      label: "Pollo / Chicken",
      items: [
        {
          slug: "pollo-frito",
          name: "Pollo Frito",
          description: "Fried chicken with fries or rice and beans.",
          price: 12,
          image: "/Menu/Pollo Frito con Papas.avif",
        },
        {
          slug: "pechuga-asada",
          name: "Pechuga Asada",
          description: "Chicken breast with rice, beans, salad and Guatemalan salsa.",
          price: 13,
          image: "/Menu/Pollo Adobado con arroz frijol ensalada rusa.avif",
        },
        {
          slug: "pollo-asado",
          name: "Pollo Asado",
          description: "Grilled chicken with rice, beans, salad and Guatemalan salsa.",
          price: 12,
          image: "/Menu/Pollo Asado.avif",
        },
      ],
    },
    {
      id: "pescado-mariscos",
      label: "Pescado / Mariscos",
      items: [
        {
          slug: "sopa-de-mariscos",
          name: "Sopa de Mariscos",
          description: "Seafood soup with rice and avocado.",
          price: 16,
        },
        {
          slug: "patin",
          name: "Patin",
          description: "Dried fish, porgie fish or bistec in tomato sauce cooked in a macha leaf.",
          price: 16,
          image: "/Menu/Patín con Camarón, Mojarra, Cesina o Pescaditos.avif",
        },
        {
          slug: "mojarra-frita",
          name: "Mojarra Frita",
          description: "Fried porgie fish served with rice, beans and salad.",
          price: 20,
        },
        {
          slug: "filete-empanizado",
          name: "Filete Empanizado",
          description: "Breaded fish filet with rice, beans and salad.",
          price: 17,
        },
        {
          slug: "ceviche",
          name: "Ceviche",
          description: "Shrimp cocktail.",
          price: 14,
        },
      ],
    },
  ],
};
