import type { MenuItem } from "../types";

export type DailySpecialsDay = {
  id: string;
  label: string;
  items: MenuItem[];
};

const dish = {
  sopaDeRes: {
    slug: "sopa-de-res",
    name: "Sopa de Res",
    description: "Beef soup served with rice.",
    price: 13,
  },
  sopaDePollo: {
    slug: "sopa-de-pollo",
    name: "Sopa de Pollo",
    description: "Chicken soup served with rice.",
    price: 12,
  },
  sopaDeGallina: {
    slug: "sopa-de-gallina",
    name: "Sopa de Gallina",
    description: "Hen soup served with rice.",
    price: 14,
    image: "/Menu/Sopa de Gallina.avif",
  },
  sopaDePata: {
    slug: "sopa-de-pata",
    name: "Sopa de Pata",
    description: "Cow feet soup served with rice.",
    price: 13,
  },
  guisadoDeRes: {
    slug: "guisado-de-res",
    name: "Guisado de Res",
    description: "Beef stew with rice, beans and salad.",
    price: 13,
    image: "/Menu/Guisado de Res.avif",
  },
  guisadoDePollo: {
    slug: "guisado-de-pollo",
    name: "Guisado de Pollo",
    description: "Chicken stew with rice and salad.",
    price: 12,
  },
  pepianDePollo: {
    slug: "pepian-de-pollo",
    name: "Pepian de Pollo",
    description: "Marinated thick chicken stew with rice and avocado.",
    price: 13,
    image: "/Menu/Pepián de Gallina o Res.avif",
  },
  pepianDeRes: {
    slug: "pepian-de-res",
    name: "Pepian de Res",
    description: "Marinated thick beef stew with rice and avocado.",
    price: 14,
    image: "/Menu/Pepián de Gallina o Res.avif",
  },
  estofadoDeRes: {
    slug: "estofado-de-res",
    name: "Estofado de Res",
    description: "Beef stew with vegetables, rice, beans and salad.",
    price: 13,
  },
  chuletaEnChirmol: {
    slug: "chuleta-en-chirmol",
    name: "Chuleta en Chirmol",
    description: "Pork chops in chirmol sauce with rice, beans and salad.",
    price: 14,
  },
  bistecEnSalsaDeTomate: {
    slug: "bistec-en-salsa-de-tomate",
    name: "Bistec en Salsa de Tomate",
    description: "Meat in tomato sauce with rice, beans and salad.",
    price: 13,
  },
  hilachasDeRes: {
    slug: "hilachas-de-res",
    name: "Hilachas de Res",
    description: "Shredded beef and vegetables in tomato broth with rice, beans and salad.",
    price: 13,
  },
  polloSopeado: {
    slug: "pollo-sopeado",
    name: "Pollo Sopeado",
    description: "Chicken soupy rice served with salad.",
    price: 12,
  },
  polloEnCrema: {
    slug: "pollo-en-crema",
    name: "Pollo en Crema",
    description: "Chicken in cream sauce with rice and salad.",
    price: 12,
  },
  chileRelleno: {
    slug: "chile-relleno",
    name: "Chile Relleno",
    description:
      "Stuffed jalapeño pepper filled with beef and veggies, served with rice, beans and salad.",
    price: 14,
  },
  chowmein: {
    slug: "chowmein",
    name: "Chowmein (Carne o Pollo)",
    description: "Stir-fried noodles with meat or chicken, served with beans and salad.",
    price: 13,
  },
  fajitasDeCamaron: {
    slug: "fajitas-de-camaron",
    name: "Fajitas de Camaron",
    description: "Sautéed shrimp with pepper and tomato, rice, beans and salad.",
    price: 15,
  },
  brocoliEnvuelto: {
    slug: "brocoli-envuelto",
    name: "Brocoli Envuelto",
    description: "Stuffed broccoli with rice, beans and salad.",
    price: 12,
  },
  coliflorEnvuelto: {
    slug: "coliflor-envuelto",
    name: "Coliflor Envuelto",
    description: "Battered cauliflower with rice, beans and salad.",
    price: 12,
  },
  pacayaEnvuelto: {
    slug: "pacaya-envuelto",
    name: "Pacaya Envuelto",
    description: "Battered pacaya blossom with rice, beans and salad.",
    price: 13,
  },
} satisfies Record<string, MenuItem>;

export const dailySpecialsNote = "All plates are served with corn tortilla.";

export const dailySpecialsDays: DailySpecialsDay[] = [
  {
    id: "sunday",
    label: "Domingo / Sunday",
    items: [
      dish.sopaDeRes,
      { ...dish.sopaDeGallina, price: 13 },
      dish.polloEnCrema,
      dish.pacayaEnvuelto,
      dish.guisadoDePollo,
      { ...dish.pepianDeRes, price: 13 },
      dish.chuletaEnChirmol,
    ],
  },
  {
    id: "monday",
    label: "Lunes / Monday",
    items: [
      dish.sopaDeRes,
      dish.sopaDePollo,
      dish.guisadoDeRes,
      dish.pepianDePollo,
      dish.estofadoDeRes,
      dish.chuletaEnChirmol,
      dish.brocoliEnvuelto,
    ],
  },
  {
    id: "tuesday",
    label: "Martes / Tuesday",
    items: [
      dish.sopaDeRes,
      dish.sopaDeGallina,
      dish.guisadoDePollo,
      dish.pepianDeRes,
      dish.bistecEnSalsaDeTomate,
      dish.chowmein,
      dish.pacayaEnvuelto,
    ],
  },
  {
    id: "wednesday",
    label: "Miercoles / Wednesday",
    items: [
      dish.sopaDeRes,
      dish.sopaDePata,
      dish.guisadoDePollo,
      dish.hilachasDeRes,
      dish.polloSopeado,
      dish.chileRelleno,
      dish.coliflorEnvuelto,
    ],
  },
  {
    id: "thursday",
    label: "Jueves / Thursday",
    items: [
      dish.sopaDeRes,
      dish.sopaDePollo,
      dish.guisadoDeRes,
      dish.pepianDePollo,
      dish.fajitasDeCamaron,
      dish.chowmein,
      dish.pacayaEnvuelto,
    ],
  },
  {
    id: "friday",
    label: "Viernes / Friday",
    items: [
      dish.sopaDeRes,
      dish.sopaDePata,
      dish.guisadoDePollo,
      dish.hilachasDeRes,
      dish.chileRelleno,
      dish.chowmein,
      dish.coliflorEnvuelto,
    ],
  },
  {
    id: "saturday",
    label: "Sabado / Saturday",
    items: [
      dish.sopaDeRes,
      dish.guisadoDeRes,
      dish.pepianDePollo,
      dish.bistecEnSalsaDeTomate,
      dish.estofadoDeRes,
      dish.fajitasDeCamaron,
      dish.brocoliEnvuelto,
    ],
  },
];
