import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const ModifierGroup: CollectionConfig = {
  slug: "modifier-group",
  labels: {
    singular: "Modifier Group",
    plural: "Modifier Groups",
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
      name: "selectionType",
      type: "select",
      label: "Selection Type",
      required: true,
      options: [
        { label: "Pick One", value: "pickOne" },
        { label: "Pick Many", value: "pickMany" },
      ],
    },
    {
      name: "required",
      type: "checkbox",
      label: "Required",
      defaultValue: false,
    },
    {
      name: "minSelection",
      type: "number",
      label: "Minimum Selections",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "maxSelection",
      type: "number",
      label: "Maximum Selections",
      defaultValue: 1,
      min: 1,
    },
    {
      name: "pricingMode",
      type: "select",
      label: "Pricing Mode",
      required: true,
      options: [
        { label: "Included", value: "included" },
        { label: "Priced", value: "priced" },
      ],
    },
    {
      name: "options",
      type: "relationship",
      label: "Options",
      relationTo: "modifier-option",
      hasMany: true,
    },
  ],
};
