// Add photos to any item by importing an asset and setting `image`.
// Items with no image render a warm gradient placeholder in the card.

import type { StaticImageData } from "next/image";

import parrilladaChapina from "@/features/restaurant/assets/Parrillada Chapina.webp";
import churrascoTikal from "@/features/restaurant/assets/Churrasco Tikal.webp";
import churrascoMixto from "@/features/restaurant/assets/Churrasco Mixto.webp";
import carneAsada from "@/features/restaurant/assets/Carne Asada.webp";
import carnitasDeCerdo from "@/features/restaurant/assets/Carnitas de Cerdo Fritas.webp";

export type MenuItem = {
  name: string;
  description: string;
  price?: number;
  priceLabel?: string;
  signature?: boolean;
  veg?: boolean;
  image?: StaticImageData;
};

export type MenuCategory = {
  id: string;
  label: string;
  note: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "signatures",
    label: "Signatures",
    note: "Chef-picked highlights — premium platters and classic Guatemalan flavors.",
    items: [
      {
        name: "Parillada Chapina",
        description:
          "The ultimate mixed grill — carne adobada, carne asada, chorizo, longaniza, guacamole, and traditional sides.",
        price: 22,
        signature: true,
        image: parrilladaChapina,
      },
      {
        name: "Churrasco Tikal",
        description:
          "Guatemalan-style grilled meats served with cebollines (grilled green onions) and coditos (macaroni salad).",
        price: 20,
        signature: true,
        image: churrascoTikal,
      },
      {
        name: "Patin",
        description:
          "Highly authentic — dried fish, porgie, or bistec cooked in a rich tomato sauce, wrapped in a macha leaf.",
        price: 16,
        signature: true,
      },
      {
        name: "Sopa de Gallina",
        description:
          "Hearty traditional hen soup — anchors our daily specials menu.",
        price: 13,
        signature: true,
      },
      {
        name: "Sopa de Res",
        description:
          "Slow-simmered beef soup, garden vegetables, herbs and lime.",
        price: 14,
        signature: true,
      },
      {
        name: "Tamales de Elote",
        description:
          "Tender corn tamales served with rich sour cream. A featured starter.",
        priceLabel: "1 for $4.00 · 2 for $7.50",
        signature: true,
        veg: true,
      },
      {
        name: "Tamales de Masa",
        description:
          "Essential Guatemalan comfort — traditional masa tamales.",
        price: 8,
        signature: true,
      },
    ],
  },
  {
    id: "carnes",
    label: "Carnes",
    note: "All meat dishes are served with traditional accompaniments.",
    items: [
      {
        name: "Parillada Chapina",
        description:
          "Grilled marinated pork, grilled meat, chorizo, longaniza, guacamole, onions, pico de gallo, salad, rice, and beans.",
        price: 22,
        signature: true,
        image: parrilladaChapina,
      },
      {
        name: "Churrasco Tikal",
        description:
          "Grilled meat, chorizo, sausage, onions, rice, and beans.",
        price: 20,
        signature: true,
        image: churrascoTikal,
      },
      {
        name: "Churrasco Mixto",
        description:
          "Grilled marinated pork, chorizo, longaniza, rice, beans, onions, and pasta salad.",
        price: 20,
        image: churrascoMixto,
      },
      {
        name: "Carne Asada",
        description: "Grilled meat served with rice, beans, and salad.",
        price: 15,
        image: carneAsada,
      },
      {
        name: "Carnitas de Cerdo Fritas",
        description: "Fried pork meat served with rice, beans, and salad.",
        price: 15,
        image: carnitasDeCerdo,
      },
    ],
  },
  {
    id: "pollo",
    label: "Pollo",
    note: "Grilled and fried chicken plates, served with rice and beans.",
    items: [
      {
        name: "Pechuga Asada",
        description:
          "Grilled chicken breast served with rice, beans, salad, and Guatemalan salsa.",
        price: 13,
      },
      {
        name: "Pollo Asado",
        description:
          "Grilled chicken served with rice, beans, salad, and Guatemalan salsa.",
        price: 12,
      },
      {
        name: "Pollo Frito",
        description:
          "Fried chicken served with your choice of fries or rice and beans.",
        price: 12,
      },
    ],
  },
  {
    id: "mariscos",
    label: "Pescado & Mariscos",
    note: "Fresh seafood, prepared in the Guatemalan tradition.",
    items: [
      {
        name: "Mojarra Frita",
        description: "Fried porgie fish served with rice, beans, and salad.",
        price: 20,
      },
      {
        name: "Filete Empanizado",
        description:
          "Breaded fish filet served with rice, beans, and salad.",
        price: 17,
      },
      {
        name: "Sopa de Mariscos",
        description:
          "Rich seafood soup served with rice and fresh avocado.",
        price: 16,
      },
      {
        name: "Patin",
        description:
          "Dried fish, porgie, or steak cooked in a savory tomato sauce, wrapped in a macha leaf.",
        price: 16,
        signature: true,
      },
      {
        name: "Ceviche / Shrimp Cocktail",
        description: "Fresh, lime-marinated shrimp mixture.",
        price: 14,
      },
    ],
  },
  {
    id: "desayunos",
    label: "Desayunos & Antojitos",
    note: "Breakfast all day, plus small plates and Guatemalan comfort eats.",
    items: [
      {
        name: "Tipico Chapin",
        description: "Grilled meat served with eggs cooked any style.",
        price: 13,
      },
      {
        name: "El Montañero",
        description:
          "Savory marinated meat served with eggs cooked any style.",
        price: 13,
      },
      {
        name: "Rey Quiche",
        description:
          "Authentic Guatemalan chorizo and sausage served with eggs any style.",
        price: 13,
      },
      {
        name: "Mixto",
        description: "Eggs scrambled with tomato, onion, and hot peppers.",
        price: 12,
        veg: true,
      },
      {
        name: "Omeleta Chapina",
        description:
          "Fluffy omelet stuffed with mushrooms, spinach, tomato, and onion.",
        price: 12,
        veg: true,
      },
      {
        name: "Huevos Rancheros",
        description:
          "Sunny-side-up eggs smothered in ranch sauce, served with rice, beans, and tortillas.",
        price: 12,
        veg: true,
      },
      {
        name: "Rellenitos de Platano",
        description:
          "Sweet plantains stuffed with black beans and cocoa powder.",
        priceLabel: "2 for $10.00",
        veg: true,
      },
      {
        name: "Tamales de Masa, Arroz, o Paches",
        description:
          "Traditional hearty Guatemalan tamales — masa, rice, or paches.",
        price: 8,
      },
      {
        name: "Chuchitos Preparados",
        description:
          "Small corn tamales stuffed with meat or chicken, topped with cheese and salad.",
        priceLabel: "2 for $8.00",
      },
      {
        name: "Pancakes con Banana y Fresas",
        description:
          "Fluffy pancakes topped with fresh bananas and strawberries.",
        price: 8,
        veg: true,
      },
      {
        name: "Tamales de Elote",
        description:
          "Tender corn tamales served with rich sour cream.",
        priceLabel: "1 for $4.00 · 2 for $7.50",
        signature: true,
        veg: true,
      },
      {
        name: "Empanadas",
        description:
          "Savory beef patties topped with salad, cheese, and chirmol.",
        priceLabel: "2 for $7.00",
      },
      {
        name: "Chuchitos",
        description:
          "Small corn tamales stuffed with seasoned meat.",
        priceLabel: "2 for $7.00",
      },
      {
        name: "Pan con Pollo",
        description: "Shredded chicken sandwich.",
        price: 7,
      },
      {
        name: "Bacon, Egg & Cheese",
        description: "Bacon, scrambled egg and melted cheese.",
        price: 6,
      },
      {
        name: "Egg & Cheese",
        description: "Scrambled egg and melted cheese.",
        price: 5,
        veg: true,
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas Calientes",
    note: "Hot drinks and Guatemalan atoles — some rotate by day of the week.",
    items: [
      {
        name: "Café / Coffee",
        description: "Freshly brewed. Available daily.",
        priceLabel: "Small $2.50 · Large $3.00",
        veg: true,
      },
      {
        name: "Té / Tea",
        description: "Hot tea. Available daily.",
        priceLabel: "Small $2.50 · Large $3.00",
        veg: true,
      },
      {
        name: "Incaparina",
        description: "Warm, spiced cereal drink. Available daily.",
        price: 3,
        veg: true,
      },
      {
        name: "Arroz con Leche",
        description: "Sweet rice pudding drink. Available daily.",
        price: 3,
        veg: true,
      },
      {
        name: "Corazon de Trigo",
        description: "Warm wheat drink. Tuesdays & Thursdays.",
        price: 4,
        veg: true,
      },
      {
        name: "Chocolate con Arroz",
        description: "Warm chocolate with rice. Wednesdays & Fridays.",
        price: 4,
        veg: true,
      },
      {
        name: "Avena / Oatmeal",
        description: "Warm sweet oatmeal drink. Wednesdays & Fridays.",
        price: 4,
        veg: true,
      },
      {
        name: "Atole de Elote",
        description: "Warm sweet corn atole. Fridays & Saturdays.",
        price: 3,
        veg: true,
      },
      {
        name: "Atole de Platano",
        description: "Warm plantain atole. Fridays & Saturdays.",
        price: 4,
        veg: true,
      },
    ],
  },
];

export type Testimonial = {
  quote: string;
  name: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The Parillada Chapina is the real deal — enough for two, and every meat is treated right.",
    name: "Jessica M.",
  },
  {
    quote:
      "Their Sopa de Gallina tastes like Sundays at abuela's. Real Guatemalan cooking.",
    name: "Daniel R.",
  },
  {
    quote:
      "Fast, friendly, and the Tamales de Elote with crema are unreal. We're regulars now.",
    name: "María L.",
  },
];
