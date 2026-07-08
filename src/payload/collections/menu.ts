import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const Menu: CollectionConfig = {
  slug: "menu",
  labels: {
    singular: "Menu",
    plural: "Menus",
  },
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: adminOrOwner,
    update: adminOrOwner,
    delete: adminOrOwner,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
    },
  ],
};
