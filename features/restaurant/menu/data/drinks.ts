import type { MenuCategoryData } from "../types";

export const drinks: MenuCategoryData = {
  id: "drinks",
  label: "Drinks & Desserts",
  subsections: [
    {
      id: "bebidas-calientes",
      label: "Hot Beverages / Bebidas Calientes",
      items: [
        {
          slug: "cafe",
          name: "Café / Coffee",
          priceLabel: "SM $2.50 · LG $3.00",
        },
        {
          slug: "te",
          name: "Té / Tea",
          priceLabel: "SM $2.50 · LG $3.00",
        },
        {
          slug: "incaparina",
          name: "Incaparina",
          price: 3,
        },
        {
          slug: "arroz-con-leche",
          name: "Arroz con Leche",
          description: "Rice pudding.",
          price: 3,
          image: "/Menu/Arroz con Leche.avif",
        },
        {
          slug: "chocolate-con-arroz",
          name: "Chocolate con Arroz",
          description: "Wednesdays & Fridays.",
          price: 4,
          image: "/Menu/Chocolate.avif",
        },
        {
          slug: "corazon-de-trigo",
          name: "Corazon de Trigo",
          description: "Tuesdays & Thursdays.",
          price: 4,
        },
        {
          slug: "atole-de-platano",
          name: "Atole de Platano",
          description: "Fridays & Saturdays.",
          price: 4,
        },
        {
          slug: "avena",
          name: "Avena / Oatmeal",
          description: "Wednesdays & Fridays.",
          price: 4,
        },
        {
          slug: "atole-de-elote",
          name: "Atole de Elote",
          description: "Fridays & Saturdays.",
          price: 3,
        },
      ],
    },
    {
      id: "granizadas",
      label: "Granizadas / Slushies",
      items: [
        {
          slug: "granizada-tradicional",
          name: "Tradicional",
          description: "Pineapple and peanut.",
          price: 10,
        },
        {
          slug: "granizada-rey-quiche",
          name: "Rey Quiche",
          description: "Pineapple.",
          price: 10,
          image: "/Menu/Piña (slushie).avif",
        },
        {
          slug: "granizada-mixta",
          name: "Mixta",
          description:
            "B8 juice, lemon, pepita, chicken consommé, jalapeños, palitos, baby corn and Takis.",
          price: 12,
        },
        {
          slug: "granizada-chica-fresa",
          name: "Chica Fresa",
          description: "Strawberry, condensed milk and peanut.",
          price: 10,
          image: "/Menu/Fresa.avif",
        },
        {
          slug: "granizada-limon",
          name: "Limon",
          description: "Lemon and pepita.",
          price: 10,
          image: "/Menu/Limón.avif",
        },
        {
          slug: "granizada-maya-york",
          name: "Maya York",
          description: "Pineapple, strawberry and candies.",
          price: 11,
          image: "/Menu/Hawaiana.avif",
        },
        {
          slug: "granizada-la-toxica",
          name: "La Toxica",
          description: "Lemon, pepita, strawberry and pineapple.",
          price: 13,
        },
      ],
    },
    {
      id: "licuados",
      label: "Licuados / Batidos",
      items: [
        {
          slug: "licuado-banano",
          name: "Banano / Banana",
          price: 7,
          image: "/Menu/Licuado de Banana.avif",
        },
        {
          slug: "licuado-fresa",
          name: "Fresa / Strawberry",
          price: 7,
          image: "/Menu/Licuado de Fresa.avif",
        },
        {
          slug: "licuado-pina",
          name: "Piña / Pineapple",
          price: 7,
          image: "/Menu/Piña.avif",
        },
        {
          slug: "licuado-mixto",
          name: "Mixto",
          description: "Banana, strawberry and pineapple.",
          price: 8,
        },
      ],
    },
    {
      id: "aguas-frescas",
      label: "Aguas / Fresh Waters",
      items: [
        {
          slug: "horchata",
          name: "Horchata",
          description: "Rice beverage.",
          price: 5,
          image: "/Menu/Horchata.avif",
        },
        {
          slug: "jamaica",
          name: "Jamaica",
          description: "Hibiscus flower.",
          price: 5,
          image: "/Menu/Jamaica.avif",
        },
        {
          slug: "melon",
          name: "Melon / Cantaloupe",
          price: 5,
          image: "/Menu/Melón.avif",
        },
        {
          slug: "tamarindo",
          name: "Tamarindo / Tamarind",
          price: 5,
          image: "/Menu/Tamarindo.avif",
        },
        {
          slug: "limonada",
          name: "Limonada / Lemonade",
          price: 5,
          image: "/Menu/Limón.avif",
        },
      ],
    },
    {
      id: "jugos",
      label: "Jugos / Juices",
      items: [
        {
          slug: "jugo-naranja",
          name: "Naranja / Orange",
          description: "Fresh squeezed orange juice.",
          price: 5,
          image: "/Menu/Naranja.avif",
        },
        {
          slug: "jugo-verde",
          name: "Jugo Verde",
          description: "Manzana, Kiwi y Limón — apple, kiwi and lime.",
          price: 7,
          image: "/Menu/Jugo Verde (Manzana, Kiwi, Limón).avif",
        },
        {
          slug: "pina-colada",
          name: "Piña Colada",
          description: "Pineapple and coconut.",
          price: 8,
          image: "/Menu/Piña Colada.avif",
        },
      ],
    },
    {
      id: "frescos",
      label: "Frescos / Beverages",
      items: [
        { slug: "tiki-pina", name: "Tiki Piña" },
        { slug: "orange-crush", name: "Orange Crush" },
        { slug: "india-quiche", name: "India Quiche" },
        { slug: "coca-cola-bottle", name: "CocaCola Bottle" },
        { slug: "pepsi", name: "Pepsi" },
        { slug: "jugos-del-frutal", name: "Jugos del Frutal" },
        { slug: "jugos-de-la-granja", name: "Jugos de la Granja" },
        { slug: "coke", name: "Coke" },
        { slug: "ginger", name: "Ginger" },
      ],
    },
    {
      id: "postres",
      label: "Postres / Desserts",
      items: [
        { slug: "chocomania", name: "Chocomania", price: 3 },
        { slug: "chocopina", name: "Chocopiña", price: 3 },
        { slug: "chocobanano", name: "Chocobanano", price: 3 },
        { slug: "rellenitos", name: "Rellenitos", price: 3.5 },
      ],
    },
  ],
};
