import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "User",
    plural: "Users",
  },
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      defaultValue: "owner",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Owner",
          value: "owner",
        },
      ],
      required: true,
    },
  ],
};
