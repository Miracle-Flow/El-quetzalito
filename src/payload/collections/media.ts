import type { CollectionConfig } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Media",
  },
  admin: {
    useAsTitle: "filename",
  },
  access: {
    read: () => true,
    create: adminOrOwner,
    update: adminOrOwner,
    delete: adminOrOwner,
  },
  upload: {
    staticDir: "public/media",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
    },
  ],
};
