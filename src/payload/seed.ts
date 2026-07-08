import { getPayload } from "payload";

import config from "../../payload.config.ts";

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
  const mainMenuId = mainMenu.id;

  console.info("[seed] upserting categories");
  const categoriesInput = [
    { name: "Platos Fuertes", slug: "platos-fuertes", sortOrder: 1 },
    { name: "Sopas", slug: "sopas", sortOrder: 2 },
    { name: "Bebidas", slug: "bebidas", sortOrder: 3 },
    { name: "Postres", slug: "postres", sortOrder: 4 },
  ];

  const categoryMap: Record<string, number | string> = {};
  for (const cat of categoriesInput) {
    const doc = await upsertCollection(payload, "category", cat.slug, {
      ...cat,
      menu: mainMenuId,
      active: true,
    });
    categoryMap[cat.slug] = doc.id;
  }

  console.info("[seed] upserting modifier groups");
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

  const groupMap: Record<string, number | string> = {};
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
      await payload.update({
        collection: "modifier-group",
        id: groupId,
        data: groupData,
      });
      console.info(`[seed] updated modifier-group ${def.slug} (${groupId})`);
    } else {
      const created = await payload.create({
        collection: "modifier-group",
        data: groupData,
      });
      groupId = created.id;
      console.info(`[seed] created modifier-group ${def.slug} (${groupId})`);
    }

    groupMap[def.slug] = groupId;
    groupOptionsMap[def.slug] = [];

    for (const opt of def.options) {
      const existingOption = await payload.find({
        collection: "modifier-option",
        where: {
          and: [{ group: { equals: groupId } }, { label: { equals: opt.label } }],
        },
        limit: 1,
        pagination: false,
      });

      const optionData = {
        label: opt.label,
        priceDelta: opt.priceDelta,
        group: groupId,
      };

      let optionId: number;
      if (existingOption.docs.length > 0 && existingOption.docs[0]?.id) {
        optionId = existingOption.docs[0].id;
        await payload.update({
          collection: "modifier-option",
          id: optionId,
          data: optionData,
        });
        console.info(`[seed] updated modifier-option ${def.slug}/${opt.label} (${optionId})`);
      } else {
        const created = await payload.create({
          collection: "modifier-option",
          data: optionData,
        });
        optionId = created.id;
        console.info(`[seed] created modifier-option ${def.slug}/${opt.label} (${optionId})`);
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
  const menuItemsInput = [
    {
      name: "Pepián",
      slug: "pepian",
      description: "A rich Guatemalan meat stew with toasted sesame and pumpkin seeds.",
      basePrice: 995,
      category: "platos-fuertes",
      availabilityType: "madeToOrder" as const,
      modifierGroups: ["sides", "spice-level"],
      sortOrder: 1,
    },
    {
      name: "Chiles Rellenos",
      slug: "chiles-rellenos",
      description: "Sweet peppers stuffed with seasoned meat and vegetables.",
      basePrice: 1095,
      category: "platos-fuertes",
      availabilityType: "madeToOrder" as const,
      modifierGroups: ["sides", "spice-level"],
      sortOrder: 2,
    },
    {
      name: "Pollo en Crema",
      slug: "pollo-en-crema",
      description: "Chicken simmered in a creamy white sauce.",
      basePrice: 895,
      category: "platos-fuertes",
      availabilityType: "steamTable" as const,
      modifierGroups: ["sides"],
      sortOrder: 3,
    },
    {
      name: "Carne Guisada",
      slug: "carne-guisada",
      description: "Slow-braised beef in a savory tomato sauce.",
      basePrice: 1050,
      category: "platos-fuertes",
      availabilityType: "steamTable" as const,
      modifierGroups: ["sides"],
      sortOrder: 4,
    },
    {
      name: "Tostadas de Pollo",
      slug: "tostadas-de-pollo",
      description: "Crispy tortillas topped with chicken, lettuce, and crema.",
      basePrice: 750,
      category: "platos-fuertes",
      availabilityType: "madeToOrder" as const,
      modifierGroups: ["spice-level"],
      sortOrder: 5,
    },
    {
      name: "Sopa de Res",
      slug: "sopa-de-res",
      description: "Hearty beef soup with vegetables and fresh cilantro.",
      basePrice: 695,
      category: "sopas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 1,
    },
    {
      name: "Sopa de Gallina",
      slug: "sopa-de-gallina",
      description: "Traditional hen soup with vegetables and herbs.",
      basePrice: 725,
      category: "sopas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 2,
    },
    {
      name: "Caldo de Pollo",
      slug: "caldo-de-pollo",
      description: "Comforting chicken broth with vegetables and rice.",
      basePrice: 675,
      category: "sopas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 3,
    },
    {
      name: "Agua de Horchata",
      slug: "agua-de-horchata",
      description: "Sweet rice drink flavored with cinnamon.",
      basePrice: 325,
      category: "bebidas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: ["bebida-size"],
      sortOrder: 1,
    },
    {
      name: "Agua de Jamaica",
      slug: "agua-de-jamaica",
      description: "Tart and refreshing hibiscus drink.",
      basePrice: 325,
      category: "bebidas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: ["bebida-size"],
      sortOrder: 2,
    },
    {
      name: "Café de Olla",
      slug: "cafe-de-olla",
      description: "Spiced coffee brewed with cinnamon and piloncillo.",
      basePrice: 275,
      category: "bebidas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 3,
    },
    {
      name: "Refresco",
      slug: "refresco",
      description: "Assorted Guatemalan soft drinks.",
      basePrice: 250,
      category: "bebidas",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 4,
    },
    {
      name: "Rellenito de Plátano",
      slug: "rellenito-de-platano",
      description: "Sweet plantain dumpling stuffed with black beans.",
      basePrice: 450,
      category: "postres",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 1,
    },
    {
      name: "Buñuelos",
      slug: "bunuelos",
      description: "Fried dough fritters drizzled with anise syrup.",
      basePrice: 395,
      category: "postres",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 2,
    },
    {
      name: "Champurrada",
      slug: "champurrada",
      description: "Guatemalan sweet bread cookie with a crisp texture.",
      basePrice: 350,
      category: "postres",
      availabilityType: "madeToOrder" as const,
      modifierGroups: [] as string[],
      sortOrder: 3,
    },
  ];

  for (const item of menuItemsInput) {
    await upsertCollection(payload, "menu-item", item.slug, {
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      category: categoryMap[item.category],
      availabilityType: item.availabilityType,
      active: true,
      modifierGroups: item.modifierGroups.map((g) => groupMap[g]),
      sortOrder: item.sortOrder,
    });
  }

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
    const updated = await payload.update({
      collection,
      id,
      data,
    });
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
    const updated = await payload.update({
      collection: "promotion",
      id,
      data,
    });
    console.info(`[seed] updated promotion ${key} (${id})`);
    return updated;
  }

  const created = await payload.create({
    collection: "promotion",
    data,
  });
  console.info(`[seed] created promotion ${key} (${created.id})`);
  return created;
}

try {
  await seed();
} catch (error) {
  console.error("[seed] failed", error);
  process.exit(1);
}
