import type { MenuCategoryData } from "../types";

export const especiales: MenuCategoryData = {
  id: "especiales",
  label: "Special Platters",
  labelEs: "Especiales",
  note: "All plates are served with corn tortilla.",
  noteEs: "Todos los platos se sirven con tortilla de maíz.",
  subsections: [
    {
      id: "carnes",
      label: "Carnes / Meats",
      labelEs: "Carnes",
      items: [
        {
          slug: "parrillada-chapina",
          name: "Parrillada Chapina",
          description:
            "Grilled marinated pork, grilled meat, chorizo, longaniza, guacamole, onions, pico de gallo and salad, served with rice and beans.",
          descriptionEs:
            "Cerdo marinado a la parrilla, carne asada, chorizo, longaniza, guacamole, cebollines, pico de gallo y ensalada, servido con arroz y frijoles.",
          price: 22,
        },
        {
          slug: "churrasco-tikal",
          name: "Churrasco Tikal",
          description: "Grilled meat, chorizo, sausage, onions, rice and beans.",
          descriptionEs: "Carne a la parrilla, chorizo, salchicha, cebollines, arroz y frijoles.",
          price: 20,
          image: "/Menu/Churrasco_Tikal.avif",
        },
        {
          slug: "churrasco-mixto",
          name: "Churrasco Mixto",
          description:
            "Grilled marinated pork, chorizo, longaniza, rice, beans, onions and pasta salad.",
          descriptionEs:
            "Cerdo marinado a la parrilla, chorizo, longaniza, arroz, frijoles, cebollines y ensalada de pasta.",
          price: 20,
        },
        {
          slug: "carne-asada",
          name: "Carne Asada",
          description: "Grilled meat served with rice, beans and salad.",
          descriptionEs: "Carne asada servida con arroz, frijoles y ensalada.",
          price: 15,
          image: "/Menu/Carne Asada.avif",
        },
        {
          slug: "carnitas-de-cerdo-fritas",
          name: "Carnitas de Cerdo Fritas",
          description: "Fried pork served with rice, beans, salad and tortillas.",
          descriptionEs:
            "Carnitas de cerdo fritas servidas con arroz, frijoles, ensalada y tortillas.",
          price: 15,
        },
        {
          slug: "costillas-bbq",
          name: "Costillas BBQ",
          description: "BBQ pork ribs served with rice, beans and salad.",
          descriptionEs: "Costillas BBQ de cerdo servidas con arroz, frijoles y ensalada.",
          price: 18,
          image: "/Menu/Costillas BBQ.avif",
        },
        {
          slug: "alitas-bbq",
          name: "Alitas BBQ",
          description: "BBQ chicken wings served with rice, beans and salad.",
          descriptionEs: "Alitas BBQ de pollo servidas con arroz, frijoles y ensalada.",
          price: 14,
          image: "/Menu/Alitas BBQ.avif",
        },
        {
          slug: "pepian-de-gallina-o-res",
          name: "Pepián de Gallina o Res",
          description:
            "Traditional Guatemalan pepian sauce with chicken or beef, rice and avocado.",
          descriptionEs: "Pepián guatemalteco tradicional con pollo o res, arroz y aguacate.",
          price: 14,
          image: "/Menu/Pepián de Gallina o Res.avif",
        },
      ],
    },
    {
      id: "pollo",
      label: "Pollo / Chicken",
      labelEs: "Pollo",
      items: [
        {
          slug: "pollo-frito",
          name: "Pollo Frito",
          description: "Fried chicken with fries or rice and beans.",
          descriptionEs: "Pollo frito con papas o arroz y frijoles.",
          price: 12,
          image: "/Menu/Pollo Frito con Papas.avif",
        },
        {
          slug: "pechuga-asada",
          name: "Pechuga Asada",
          description: "Chicken breast with rice, beans, salad and Guatemalan salsa.",
          descriptionEs:
            "Pechuga de pollo asada con arroz, frijoles, ensalada y salsa guatemalteca.",
          price: 13,
          image: "/Menu/Pollo Adobado con arroz frijol ensalada rusa.avif",
        },
        {
          slug: "pollo-asado",
          name: "Pollo Asado",
          description: "Grilled chicken with rice, beans, salad and Guatemalan salsa.",
          descriptionEs: "Pollo asado con arroz, frijoles, ensalada y salsa guatemalteca.",
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
          descriptionEs: "Sopa de mariscos con arroz y aguacate.",
          price: 16,
        },
        {
          slug: "patin",
          name: "Patin",
          description: "Dried fish, porgie fish or bistec in tomato sauce cooked in a macha leaf.",
          descriptionEs:
            "Pescado seco, mojarra o bistec en salsa de tomate cocido en hoja de mashan.",
          price: 16,
          image: "/Menu/Patín con Camarón, Mojarra, Cesina o Pescaditos.avif",
        },
        {
          slug: "mojarra-frita",
          name: "Mojarra Frita",
          description: "Fried porgie fish served with rice, beans and salad.",
          descriptionEs: "Mojarra frita servida con arroz, frijoles y ensalada.",
          price: 20,
        },
        {
          slug: "filete-empanizado",
          name: "Filete Empanizado",
          description: "Breaded fish filet with rice, beans and salad.",
          descriptionEs: "Filete de pescado empanizado con arroz, frijoles y ensalada.",
          price: 17,
        },
        {
          slug: "ceviche",
          name: "Ceviche",
          description: "Shrimp cocktail.",
          descriptionEs: "Cóctel de camarón.",
          price: 14,
        },
      ],
    },
  ],
};
