import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const Category: CollectionConfig = {
  slug: "category",
  labels: {
    singular: "Category",
    plural: "Categories",
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
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "menu",
      type: "relationship",
      label: "Menu",
      relationTo: "menu",
      hasMany: false,
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      required: true,
    },
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
    },
  ],
};
