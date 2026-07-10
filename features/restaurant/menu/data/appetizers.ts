import type { MenuCategoryData } from "../types";

export const appetizers: MenuCategoryData = {
  id: "appetizers",
  label: "Appetizers / Aperitivos",
  subsections: [
    {
      id: "shucos",
      label: "Shucos / Guatemalan Hero",
      note: "Served with french fries $3.00 extra.",
      items: [
        {
          slug: "shuco-tradicional",
          name: "Shuco Tradicional",
          description: "Grilled meat, sausage and chorizo.",
          price: 17,
        },
        {
          slug: "shuco-quetzalito",
          name: "Shuco Quetzalito",
          description: "Fried chicken, bacon and sausage.",
          price: 17,
        },
        {
          slug: "shuco-chapin",
          name: "Shuco Chapin",
          description: "Marinated pork, chorizo and sausage.",
          price: 17,
        },
      ],
    },
    {
      id: "mixtas",
      label: "Mixtas / Corn Flour Tortilla",
      note: "Served with guacamole, cabbage and salsas. With french fries $3.00 extra.",
      items: [
        {
          slug: "mixta-rey-quiche",
          name: "Mixta Rey Quiche",
          description: "Sausage and grilled meat.",
          price: 17,
        },
        {
          slug: "mixta-chapina",
          name: "Mixta Chapina",
          description: "Marinated pork, sausage and chorizo.",
          price: 17,
        },
        {
          slug: "mixta-maya-york",
          name: "Mixta Maya York",
          description: "Sausage, grilled steak, chorizo and longaniza.",
          price: 17,
        },
      ],
    },
    {
      id: "pupusas",
      label: "Pupusas",
      note: "Served with cabbage and salsas.",
      items: [
        {
          slug: "pupusa-chicharron",
          name: "Pupusa de Chicharron",
          description: "Pork skin.",
          price: 12,
        },
        {
          slug: "pupusa-chicharron-con-queso",
          name: "Pupusa de Chicharron con Queso",
          description: "Pork skin and cheese.",
          price: 13,
        },
        {
          slug: "pupusa-mixta",
          name: "Pupusa Mixta",
          description: "Pork skin, cheese and beans.",
          price: 14,
        },
      ],
    },
    {
      id: "tacos",
      label: "Tacos / Corn Flour Tortilla",
      items: [
        {
          slug: "tacos-de-pollo",
          name: "Tacos de Pollo",
          description: "Grilled chicken.",
          priceLabel: "3 × $11.99",
        },
        {
          slug: "tacos-de-res",
          name: "Tacos de Res",
          description: "Grilled meat.",
          priceLabel: "3 × $11.99",
        },
        {
          slug: "tacos-de-chorizo",
          name: "Tacos de Chorizo",
          description: "Guatemalan sausage.",
          priceLabel: "3 × $11.99",
        },
      ],
    },
    {
      id: "antojitos",
      label: "More Appetizers",
      items: [
        {
          slug: "torta-chapina",
          name: "Torta Chapina",
          description: "Sausage, Guatemalan chorizo, Muenster cheese, ham and mayo.",
          price: 14,
        },
        {
          slug: "salchipapas",
          name: "Salchipapas",
          description: "Fried sausage, french fries, mayo and ketchup.",
          price: 10,
        },
        {
          slug: "papi-pollo-ecuatoriano",
          name: "Papi Pollo Ecuatoriano",
          description: "Fried chicken, french fries, mayo and ketchup.",
          price: 10,
        },
      ],
    },
  ],
};
