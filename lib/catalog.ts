import type { MenuItem } from "../payload-types.ts";

export type CatalogBySlug = Record<string, MenuItem>;

async function getPayloadInstance() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("@payload-config");
  return getPayload({ config });
}

export async function getOrderableCatalog(): Promise<CatalogBySlug> {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "menu-item",
    depth: 2,
    where: { active: { equals: true } },
    limit: 0,
    pagination: false,
  });

  const catalog: CatalogBySlug = {};
  for (const item of result.docs) {
    if (item.slug) {
      catalog[item.slug] = item;
    }
  }
  return catalog;
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  const payload = await getPayloadInstance();

  const result = await payload.find({
    collection: "menu-item",
    depth: 2,
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    limit: 1,
    pagination: false,
  });

  return result.docs[0] ?? null;
}
