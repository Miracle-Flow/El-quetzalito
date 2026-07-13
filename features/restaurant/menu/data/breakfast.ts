import type { MenuCategoryData } from "../types";

export const breakfast: MenuCategoryData = {
  id: "breakfast",
  label: "Breakfast",
  labelEs: "Desayunos",
  note: "Served all day. After 1:00 PM $3.00 extra.",
  noteEs: "Se sirve todo el día. Después de la 1:00 PM $3.00 extra.",
  subsections: [
    {
      id: "breakfast-all",
      items: [
        {
          slug: "tipico-chapin",
          name: "Tipico Chapin",
          description: "Grilled meat with eggs any style.",
          descriptionEs: "Carne a la parrilla con huevos al gusto.",
          price: 13,
          image: "/Menu/Desayuno Chapín.avif",
        },
        {
          slug: "el-montanero",
          name: "El Montañero",
          description: "Marinated meat with eggs any style.",
          descriptionEs: "Carne marinada con huevos al gusto.",
          price: 13,
          image: "/Menu/Desayuno El Buen Amanecer.avif",
        },
        {
          slug: "rey-quiche",
          name: "Rey Quiche",
          description: "Guatemalan chorizo and sausage with eggs any style.",
          descriptionEs: "Chorizo y salchicha guatemalteca con huevos al gusto.",
          price: 13,
          image: "/Menu/Desayuno El Quetzalito.avif",
        },
        {
          slug: "mixto",
          name: "Mixto",
          description: "Eggs any style with tomato, onion and hot peppers.",
          descriptionEs: "Huevos al gusto con tomate, cebolla y chiles.",
          price: 12,
        },
        {
          slug: "omeleta-chapina",
          name: "Omeleta Chapina",
          description: "Guatemalan-style omelet with mushrooms, spinach, tomato and onion.",
          descriptionEs: "Omelette estilo chapín con hongos, espinaca, tomate y cebolla.",
          price: 12,
          image: "/Menu/Omelette.avif",
        },
        {
          slug: "huevos-rancheros",
          name: "Huevos Rancheros",
          description:
            "Sunny-side eggs with ranch sauce, served with fried plantain, rice, beans, cheese, cream and tortillas.",
          descriptionEs:
            "Huevos fritos en salsa ranchera, servidos con plátano frito, arroz, frijoles, queso, crema y tortillas.",
          price: 12,
        },
        {
          slug: "pancakes-con-banana-y-fresas",
          name: "Pancakes con Banana y Fresas",
          description: "Pancakes with banana and strawberries.",
          descriptionEs: "Panqueques con banano y fresas.",
          price: 8,
          image: "/Menu/Pancakes con Huevos.avif",
        },
        {
          slug: "tamales-de-elote",
          name: "Tamales de Elote",
          description: "Tender corn tamales served with sour cream.",
          descriptionEs: "Tamales de elote tiernos servidos con crema.",
          priceLabel: "$4.00 (1) · $7.50 (2)",
        },
        {
          slug: "tamales-de-masa",
          name: "Tamales de Masa, Arroz o Paches",
          description: "Traditional Guatemalan tamales — masa, rice or paches.",
          descriptionEs: "Tamales guatemaltecos tradicionales — de masa, arroz o paches.",
          price: 8,
        },
        {
          slug: "chuchitos",
          name: "Chuchitos",
          description: "Small corn tamales stuffed with meat.",
          descriptionEs: "Chuchitos de masa rellenos de carne.",
          priceLabel: "$7.00 (2)",
        },
        {
          slug: "chuchitos-preparados",
          name: "Chuchitos Preparados",
          description: "Small corn tamales stuffed with meat or chicken, with cheese and salad.",
          descriptionEs: "Chuchitos rellenos de carne o pollo, con queso y ensalada.",
          priceLabel: "$8.00 (2)",
        },
        {
          slug: "rellenitos-de-platano",
          name: "Rellenitos de Platano",
          description:
            "Sweet plantains stuffed with black beans and cocoa powder, with salad and cheese.",
          descriptionEs:
            "Plátanos dulces rellenos de frijoles negros y cacao, con ensalada y queso.",
          priceLabel: "$10.00 (2)",
        },
        {
          slug: "pan-con-pollo",
          name: "Pan con Pollo",
          description: "Shredded chicken sandwich.",
          descriptionEs: "Sándwich de pollo deshebrado.",
          price: 7,
          image: "/Menu/Pan con Pollo.avif",
        },
        {
          slug: "empanadas",
          name: "Empanadas",
          description: "Beef patties with salad, cheese and chirmol.",
          descriptionEs: "Empanadas de carne con ensalada, queso y chirmol.",
          priceLabel: "$7.00 (2)",
        },
        {
          slug: "bacon-egg-and-cheese",
          name: "Bacon, Egg and Cheese",
          price: 6,
        },
        {
          slug: "egg-and-cheese",
          name: "Egg and Cheese",
          price: 5,
        },
      ],
    },
  ],
};
