import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const ModifierOption: CollectionConfig = {
  slug: "modifier-option",
  labels: {
    singular: "Modifier Option",
    plural: "Modifier Options",
  },
  admin: {
    useAsTitle: "label",
  },
  access: {
    read: () => true,
    create: adminOrOwner,
    update: adminOrOwner,
    delete: adminOrOwner,
  },
  fields: [
    {
      name: "label",
      type: "text",
      label: "Label",
      required: true,
    },
    {
      name: "priceDelta",
      type: "number",
      label: "Price Delta (cents)",
      defaultValue: 0,
      min: 0,
      required: true,
    },
    {
      name: "group",
      type: "relationship",
      label: "Modifier Group",
      relationTo: "modifier-group",
      hasMany: false,
      required: true,
    },
  ],
};
