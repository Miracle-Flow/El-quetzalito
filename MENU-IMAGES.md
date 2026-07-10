# Menu item images

Every menu card looks for a photo at:

```
public/menu/<category-folder>/<slug>.<ext>
```

- Allowed extensions, tried in this order: **`.jpg`**, **`.webp`**, **`.png`** (lowercase).
- The filename (slug) must match **exactly** — lowercase, hyphens, no accents, no spaces.
- **If no file exists, nothing breaks**: the card automatically renders text-only (name, description, price). Just drop a correctly-named file in the right folder and the photo appears — no code change needed.
- Recommended: landscape photos around **800×600** (cards crop to a 4:3 frame).

Dishes that repeat across days of the week use **one** shared image in `daily-specials/`.

## `public/menu/daily-specials/`

| File name (add `.jpg`/`.webp`/`.png`) | Dish |
| --- | --- |
| `sopa-de-res` | Sopa de Res |
| `sopa-de-pollo` | Sopa de Pollo |
| `sopa-de-gallina` | Sopa de Gallina |
| `sopa-de-pata` | Sopa de Pata |
| `guisado-de-res` | Guisado de Res |
| `guisado-de-pollo` | Guisado de Pollo |
| `pepian-de-pollo` | Pepian de Pollo |
| `pepian-de-res` | Pepian de Res |
| `estofado-de-res` | Estofado de Res |
| `chuleta-en-chirmol` | Chuleta en Chirmol |
| `bistec-en-salsa-de-tomate` | Bistec en Salsa de Tomate |
| `hilachas-de-res` | Hilachas de Res |
| `pollo-sopeado` | Pollo Sopeado |
| `pollo-en-crema` | Pollo en Crema |
| `chile-relleno` | Chile Relleno |
| `chowmein` | Chowmein (Carne o Pollo) |
| `fajitas-de-camaron` | Fajitas de Camaron |
| `brocoli-envuelto` | Brocoli Envuelto |
| `coliflor-envuelto` | Coliflor Envuelto |
| `pacaya-envuelto` | Pacaya Envuelto |

## `public/menu/breakfast/`

| File name | Dish |
| --- | --- |
| `tipico-chapin` | Tipico Chapin |
| `el-montanero` | El Montañero |
| `rey-quiche` | Rey Quiche |
| `mixto` | Mixto |
| `omeleta-chapina` | Omeleta Chapina |
| `huevos-rancheros` | Huevos Rancheros |
| `tamales-de-elote` | Tamales de Elote |
| `tamales-de-masa` | Tamales de Masa, Arroz o Paches |
| `chuchitos` | Chuchitos |
| `chuchitos-preparados` | Chuchitos Preparados |
| `rellenitos-de-platano` | Rellenitos de Platano |
| `pan-con-pollo` | Pan con Pollo |
| `empanadas` | Empanadas |
| `bacon-egg-and-cheese` | Bacon, Egg and Cheese |
| `egg-and-cheese` | Egg and Cheese |
| `pancakes-con-banana-y-fresas` | Pancakes con Banana y Fresas |

## `public/menu/appetizers/`

| File name | Dish |
| --- | --- |
| `shuco-tradicional` | Shuco Tradicional |
| `shuco-quetzalito` | Shuco Quetzalito |
| `shuco-chapin` | Shuco Chapin |
| `mixta-rey-quiche` | Mixta Rey Quiche |
| `mixta-chapina` | Mixta Chapina |
| `mixta-maya-york` | Mixta Maya York |
| `pupusa-chicharron` | Pupusa de Chicharron |
| `pupusa-chicharron-con-queso` | Pupusa de Chicharron con Queso |
| `pupusa-mixta` | Pupusa Mixta |
| `tacos-de-pollo` | Tacos de Pollo |
| `tacos-de-res` | Tacos de Res |
| `tacos-de-chorizo` | Tacos de Chorizo |
| `torta-chapina` | Torta Chapina |
| `salchipapas` | Salchipapas |
| `papi-pollo-ecuatoriano` | Papi Pollo Ecuatoriano |

## `public/menu/especiales/`

| File name | Dish | |
| --- | --- | --- |
| `parrillada-chapina` | Parrillada Chapina | ✅ already added (`.webp`) |
| `churrasco-tikal` | Churrasco Tikal | ✅ already added (`.webp`) |
| `churrasco-mixto` | Churrasco Mixto | ✅ already added (`.webp`) |
| `carne-asada` | Carne Asada | ✅ already added (`.webp`) |
| `carnitas-de-cerdo-fritas` | Carnitas de Cerdo Fritas | ✅ already added (`.webp`) |
| `pollo-frito` | Pollo Frito | |
| `pechuga-asada` | Pechuga Asada | |
| `pollo-asado` | Pollo Asado | |
| `sopa-de-mariscos` | Sopa de Mariscos | |
| `patin` | Patin | |
| `mojarra-frita` | Mojarra Frita | |
| `filete-empanizado` | Filete Empanizado | |
| `ceviche` | Ceviche | |

## `public/menu/drinks/`

| File name | Item |
| --- | --- |
| `cafe` | Café / Coffee |
| `te` | Té / Tea |
| `incaparina` | Incaparina |
| `arroz-con-leche` | Arroz con Leche |
| `chocolate-con-arroz` | Chocolate con Arroz |
| `corazon-de-trigo` | Corazon de Trigo |
| `atole-de-platano` | Atole de Platano |
| `avena` | Avena / Oatmeal |
| `atole-de-elote` | Atole de Elote |
| `granizada-tradicional` | Granizada Tradicional |
| `granizada-rey-quiche` | Granizada Rey Quiche |
| `granizada-mixta` | Granizada Mixta |
| `granizada-chica-fresa` | Granizada Chica Fresa |
| `granizada-limon` | Granizada Limon |
| `granizada-maya-york` | Granizada Maya York |
| `granizada-la-toxica` | Granizada La Toxica |
| `licuado-banano` | Licuado de Banano |
| `licuado-fresa` | Licuado de Fresa |
| `licuado-pina` | Licuado de Piña |
| `licuado-mixto` | Licuado Mixto |
| `horchata` | Horchata |
| `jamaica` | Jamaica |
| `melon` | Melon / Cantaloupe |
| `tamarindo` | Tamarindo |
| `limonada` | Limonada |
| `tiki-pina` | Tiki Piña |
| `orange-crush` | Orange Crush |
| `india-quiche` | India Quiche |
| `coca-cola-bottle` | CocaCola Bottle |
| `pepsi` | Pepsi |
| `jugos-del-frutal` | Jugos del Frutal |
| `jugos-de-la-granja` | Jugos de la Granja |
| `coke` | Coke |
| `ginger` | Ginger |
| `chocomania` | Chocomania |
| `chocopina` | Chocopiña |
| `chocobanano` | Chocobanano |
| `rellenitos` | Rellenitos |

## Adding a new dish later

1. Add the item to the right file in `features/restaurant/menu/data/` with a new `slug`.
2. Drop its photo at `public/menu/<category>/<slug>.jpg`.
