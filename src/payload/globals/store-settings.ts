import type { GlobalConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const StoreSettings: GlobalConfig = {
  slug: "store-settings",
  label: "Store Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: adminOrOwner,
  },
  fields: [
    {
      name: "storeName",
      type: "text",
      label: "Store Name",
      defaultValue: "El Quetzalito",
      required: true,
    },
    {
      name: "isOpen",
      type: "checkbox",
      label: "Accepting Orders",
      defaultValue: true,
    },
    {
      name: "weeklyHours",
      type: "array",
      label: "Weekly Hours",
      fields: [
        {
          name: "day",
          type: "select",
          label: "Day",
          required: true,
          options: [
            { label: "Monday", value: "Mon" },
            { label: "Tuesday", value: "Tue" },
            { label: "Wednesday", value: "Wed" },
            { label: "Thursday", value: "Thu" },
            { label: "Friday", value: "Fri" },
            { label: "Saturday", value: "Sat" },
            { label: "Sunday", value: "Sun" },
          ],
        },
        {
          name: "open",
          type: "text",
          label: "Open",
          defaultValue: "10:00",
        },
        {
          name: "close",
          type: "text",
          label: "Close",
          defaultValue: "20:00",
        },
        {
          name: "closed",
          type: "checkbox",
          label: "Closed",
          defaultValue: false,
        },
      ],
    },
    {
      name: "dailyOverrides",
      type: "array",
      label: "Daily Overrides",
      fields: [
        {
          name: "date",
          type: "date",
          label: "Date",
          required: true,
        },
        {
          name: "closed",
          type: "checkbox",
          label: "Closed",
          defaultValue: false,
        },
        {
          name: "open",
          type: "text",
          label: "Open",
        },
        {
          name: "close",
          type: "text",
          label: "Close",
        },
      ],
    },
    {
      name: "timezone",
      type: "text",
      label: "Timezone",
      defaultValue: "America/New_York",
      required: true,
    },
    {
      name: "taxRate",
      type: "number",
      label: "Tax Rate",
      defaultValue: 0.08875,
      min: 0,
      max: 1,
    },
    {
      name: "leadTimeMinutes",
      type: "number",
      label: "Pickup Lead Time (minutes)",
      defaultValue: 20,
      min: 0,
    },
    {
      name: "slotIntervalMinutes",
      type: "number",
      label: "Slot Interval (minutes)",
      defaultValue: 15,
      min: 5,
    },
    {
      name: "tipPresets",
      type: "array",
      label: "Tip Presets",
      fields: [
        {
          name: "value",
          type: "number",
          label: "Percentage",
          required: true,
          min: 0,
        },
      ],
      defaultValue: [{ value: 15 }, { value: 18 }, { value: 20 }],
    },
    {
      name: "address",
      type: "text",
      label: "Address",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
    },
    {
      name: "pickupInstructions",
      type: "textarea",
      label: "Pickup Instructions",
    },
  ],
};
