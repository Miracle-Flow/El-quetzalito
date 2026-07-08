import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const DailyAvailability: CollectionConfig = {
  slug: "daily-availability",
  labels: {
    singular: "Daily Availability",
    plural: "Daily Availabilities",
  },
  admin: {
    useAsTitle: "date",
    description:
      "soldOut status hides the item from the storefront for that day. Steam-table items default to available unless a soldOut record exists.",
  },
  access: {
    read: () => true,
    create: adminOrOwner,
    update: adminOrOwner,
    delete: adminOrOwner,
  },
  fields: [
    {
      name: "date",
      type: "date",
      label: "Date",
      required: true,
    },
    {
      name: "menuItem",
      type: "relationship",
      label: "Menu Item",
      relationTo: "menu-item",
      hasMany: false,
      required: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      options: [
        { label: "Available", value: "available" },
        { label: "Sold Out", value: "soldOut" },
      ],
      defaultValue: "available",
    },
  ],
  indexes: [
    {
      fields: ["date", "menuItem"],
      unique: true,
    },
  ],
};
