import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const MenuItem: CollectionConfig = {
  slug: "menu-item",
  labels: {
    singular: "Menu Item",
    plural: "Menu Items",
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
      name: "basePrice",
      type: "number",
      label: "Base Price (cents)",
      required: true,
      min: 0,
    },
    {
      name: "category",
      type: "relationship",
      label: "Category",
      relationTo: "category",
      hasMany: false,
      required: true,
    },
    {
      name: "availabilityType",
      type: "select",
      label: "Availability Type",
      required: true,
      options: [
        { label: "Steam Table", value: "steamTable" },
        { label: "Made to Order", value: "madeToOrder" },
      ],
    },
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
    },
    {
      name: "image",
      type: "upload",
      label: "Image",
      relationTo: "media",
    },
    {
      name: "modifierGroups",
      type: "relationship",
      label: "Modifier Groups",
      relationTo: "modifier-group",
      hasMany: true,
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      required: true,
    },
  ],
};
