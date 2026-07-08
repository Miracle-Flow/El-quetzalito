import type { CollectionConfig } from "payload";

export const MigrationCheck: CollectionConfig = {
  slug: "migration-check",
  labels: {
    singular: "Migration Check",
    plural: "Migration Checks",
  },
  admin: {
    useAsTitle: "label",
  },
  fields: [
    {
      name: "label",
      type: "text",
      label: "Label",
      required: true,
    },
  ],
};
