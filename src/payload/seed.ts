import { getPayload } from "payload";

import { dailySpecialsDays } from "../../features/restaurant/menu/data/dailySpecials.ts";
import { DAILY_SPECIALS_ID, menuCategories } from "../../features/restaurant/menu/data/index.ts";
import type {
  MenuCategoryData,
  MenuItem as StaticMenuItem,
} from "../../features/restaurant/menu/types.ts";
import config from "../../payload.config.ts";

interface SeedItem {
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  categorySlug: string;
  availabilityType: "steamTable" | "madeToOrder";
  modifierGroupSlugs: string[];
  sortOrder: number;
}

const PLATTER_GROUPS = ["sides", "spice-level"];
const DRINK_SIZE_GROUPS = ["bebida-size"];

const DRINK_SIZE_SUBSECTIONS = new Set(["aguas-frescas", "licuados", "jugos", "granizadas"]);

function isOrderable(item: StaticMenuItem): item is StaticMenuItem & { price: number } {
  return typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0;
}

function flattenCategory(
  category: MenuCategoryData,
  availabilityType: "steamTable" | "madeToOrder",
  groupSelector: (subId: string) => string[],
): SeedItem[] {
  let order = 0;
  const items: SeedItem[] = [];
  const seen = new Set<string>();

  for (const sub of category.subsections) {
    for (const item of sub.items) {
      if (!isOrderable(item) || seen.has(item.slug)) {
        continue;
      }
      seen.add(item.slug);
      items.push({
        slug: item.slug,
        name: item.name,
        description: item.description ?? null,
        basePrice: Math.round(item.price * 100),
        categorySlug: category.id,
        availabilityType,
        modifierGroupSlugs: groupSelector(sub.id),
        sortOrder: (order += 1),
      });
    }
  }

  return items;
}

function flattenDailySpecials(): SeedItem[] {
  const seen = new Map<string, SeedItem>();
  let order = 0;

  for (const day of dailySpecialsDays) {
    for (const item of day.items) {
      if (!isOrderable(item) || seen.has(item.slug)) {
        continue;
      }
      seen.set(item.slug, {
        slug: item.slug,
        name: item.name,
        description: item.description ?? null,
        basePrice: Math.round(item.price * 100),
        categorySlug: DAILY_SPECIALS_ID,
        availabilityType: "steamTable",
        modifierGroupSlugs: PLATTER_GROUPS,
        sortOrder: (order += 1),
      });
    }
  }

  return [...seen.values()];
}

function buildSeedItems(): SeedItem[] {
  const items: SeedItem[] = [];
  const seen = new Set<string>();

  function addAll(list: SeedItem[]) {
    for (const item of list) {
      if (seen.has(item.slug)) {
        continue;
      }
      seen.add(item.slug);
      items.push(item);
    }
  }

  for (const category of menuCategories) {
    const isEspeciales = category.id === "especiales";
    addAll(
      flattenCategory(category, "madeToOrder", (subId) =>
        isEspeciales ? PLATTER_GROUPS : DRINK_SIZE_SUBSECTIONS.has(subId) ? DRINK_SIZE_GROUPS : [],
      ),
    );
  }

  addAll(flattenDailySpecials());

  return items;
}

const groupDefinitions = [
  {
    slug: "sides",
    label: "Sides",
    selectionType: "pickMany" as const,
    required: true,
    minSelection: 2,
    maxSelection: 2,
    pricingMode: "included" as const,
    options: [
      { label: "Arroz", priceDelta: 0 },
      { label: "Frijoles", priceDelta: 0 },
      { label: "Ensalada", priceDelta: 50 },
      { label: "Plátanos fritos", priceDelta: 75 },
    ],
  },
  {
    slug: "spice-level",
    label: "Spice Level",
    selectionType: "pickOne" as const,
    required: false,
    minSelection: 0,
    maxSelection: 1,
    pricingMode: "included" as const,
    options: [
      { label: "Mild", priceDelta: 0 },
      { label: "Medium", priceDelta: 0 },
      { label: "Hot", priceDelta: 0 },
    ],
  },
  {
    slug: "size",
    label: "Size",
    selectionType: "pickOne" as const,
    required: false,
    minSelection: 0,
    maxSelection: 1,
    pricingMode: "priced" as const,
    options: [
      { label: "Regular", priceDelta: 0 },
      { label: "Large", priceDelta: 150 },
    ],
  },
  {
    slug: "bebida-size",
    label: "Beverage Size",
    selectionType: "pickOne" as const,
    required: false,
    minSelection: 0,
    maxSelection: 1,
    pricingMode: "priced" as const,
    options: [
      { label: "Regular", priceDelta: 0 },
      { label: "Large", priceDelta: 100 },
    ],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  console.info("[seed] upserting store settings");
  await payload.updateGlobal({
    slug: "store-settings",
    data: {
      storeName: "El Quetzalito",
      isOpen: true,
      weeklyHours: [
        { day: "Mon", open: "10:00", close: "20:00", closed: false },
        { day: "Tue", open: "10:00", close: "20:00", closed: false },
        { day: "Wed", open: "10:00", close: "20:00", closed: false },
        { day: "Thu", open: "10:00", close: "20:00", closed: false },
        { day: "Fri", open: "10:00", close: "20:00", closed: false },
        { day: "Sat", open: "10:00", close: "20:00", closed: false },
        { day: "Sun", open: "10:00", close: "20:00", closed: false },
      ],
      timezone: "America/New_York",
      taxRate: 0.08875,
      leadTimeMinutes: 20,
      slotIntervalMinutes: 15,
      tipPresets: [{ value: 15 }, { value: 18 }, { value: 20 }],
      address: "123 Main St",
      phone: "555-1234",
      pickupInstructions: "Pick up at the counter.",
    },
  });

  console.info("[seed] upserting main menu");
  const mainMenu = await upsertCollection(payload, "menu", "main", {
    name: "Main Menu",
    slug: "main",
    active: true,
  });

  console.info("[seed] upserting categories");
  const categoryInputs = [
    ...menuCategories.map((cat, index) => ({
      name: cat.label,
      slug: cat.id,
      sortOrder: index + 1,
    })),
    {
      name: "Daily Specials / Especiales Diarios",
      slug: DAILY_SPECIALS_ID,
      sortOrder: 0,
    },
  ];

  const categoryMap: Record<string, number | string> = {};
  for (const cat of categoryInputs) {
    const doc = await upsertCollection(payload, "category", cat.slug, {
      ...cat,
      menu: mainMenu.id,
      active: true,
    });
    categoryMap[cat.slug] = doc.id;
  }

  console.info("[seed] upserting modifier groups");
  const groupMap: Record<string, number> = {};
  const groupOptionsMap: Record<string, number[]> = {};

  for (const def of groupDefinitions) {
    const existingGroup = await payload.find({
      collection: "modifier-group",
      where: { label: { equals: def.label } },
      limit: 1,
      pagination: false,
    });

    const groupData = {
      label: def.label,
      selectionType: def.selectionType,
      required: def.required,
      minSelection: def.minSelection,
      maxSelection: def.maxSelection,
      pricingMode: def.pricingMode,
      options: [] as number[],
    };

    let groupId: number;
    if (existingGroup.docs.length > 0 && existingGroup.docs[0]?.id) {
      groupId = existingGroup.docs[0].id;
      await payload.update({ collection: "modifier-group", id: groupId, data: groupData });
      console.info(`[seed] updated modifier-group ${def.slug} (${groupId})`);
    } else {
      const created = await payload.create({ collection: "modifier-group", data: groupData });
      groupId = created.id;
      console.info(`[seed] created modifier-group ${def.slug} (${groupId})`);
    }

    groupMap[def.slug] = groupId;
    groupOptionsMap[def.slug] = [];

    for (const opt of def.options) {
      const existingOption = await payload.find({
        collection: "modifier-option",
        where: { and: [{ group: { equals: groupId } }, { label: { equals: opt.label } }] },
        limit: 1,
        pagination: false,
      });

      const optionData = { label: opt.label, priceDelta: opt.priceDelta, group: groupId };

      let optionId: number;
      if (existingOption.docs.length > 0 && existingOption.docs[0]?.id) {
        optionId = existingOption.docs[0].id;
        await payload.update({ collection: "modifier-option", id: optionId, data: optionData });
      } else {
        const created = await payload.create({ collection: "modifier-option", data: optionData });
        optionId = created.id;
      }
      groupOptionsMap[def.slug].push(optionId);
    }

    await payload.update({
      collection: "modifier-group",
      id: groupId,
      data: { options: groupOptionsMap[def.slug] },
    });
  }

  console.info("[seed] upserting menu items");
  const seedItems = buildSeedItems();
  for (const item of seedItems) {
    await upsertCollection(payload, "menu-item", item.slug, {
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      category: categoryMap[item.categorySlug],
      availabilityType: item.availabilityType,
      active: true,
      modifierGroups: item.modifierGroupSlugs.map((g) => groupMap[g]),
      sortOrder: item.sortOrder,
    });
  }
  console.info(`[seed] upserted ${seedItems.length} menu items`);

  console.info("[seed] upserting promotions");
  await upsertPromotion(payload, {
    name: "Automatic 10% Off",
    applicationType: "auto",
    discountType: "percent",
    value: 10,
    scope: "order",
    active: true,
  });

  await upsertPromotion(payload, {
    name: "GUATE25",
    applicationType: "code",
    code: "GUATE25",
    discountType: "fixed",
    value: 250,
    scope: "order",
    minOrderValue: 1200,
    active: true,
  });

  console.info("[seed] complete");
  process.exit(0);
}

async function upsertCollection(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "menu" | "category" | "menu-item" | "promotion",
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    pagination: false,
  });

  if (existing.docs.length > 0 && existing.docs[0]?.id) {
    const id = existing.docs[0].id;
    const updated = await payload.update({ collection, id, data });
    console.info(`[seed] updated ${collection} ${slug} (${id})`);
    return updated;
  }

  const created = await payload.create({
    collection,
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    data: { ...data, slug } as never,
  });
  console.info(`[seed] created ${collection} ${slug} (${created.id})`);
  return created;
}

async function upsertPromotion(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: {
    name: string;
    applicationType: "auto" | "code";
    code?: string;
    discountType: "percent" | "fixed";
    value: number;
    scope: "order" | "category";
    minOrderValue?: number;
    active?: boolean;
  },
) {
  const key = data.code ?? data.name;
  const where = (
    data.code ? { code: { equals: data.code } } : { name: { equals: data.name } }
  ) as Record<string, { equals: string }>;

  const existing = await payload.find({
    collection: "promotion",
    where,
    limit: 1,
    pagination: false,
  });

  if (existing.docs.length > 0 && existing.docs[0]?.id) {
    const id = existing.docs[0].id;
    const updated = await payload.update({ collection: "promotion", id, data });
    console.info(`[seed] updated promotion ${key} (${id})`);
    return updated;
  }

  const created = await payload.create({ collection: "promotion", data });
  console.info(`[seed] created promotion ${key} (${created.id})`);
  return created;
}

try {
  await seed();
} catch (error) {
  console.error("[seed] failed", error);
  process.exit(1);
}
