import type { CollectionConfig, FieldHook } from "payload";

const adminOrOwner = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === "admin" || req.user?.role === "owner";

const validateCode: FieldHook = ({ siblingData, value }): string | undefined => {
  const data = siblingData as { applicationType?: "auto" | "code" };
  if (data.applicationType === "code" && !value) {
    return "A code is required when application type is Code.";
  }
  return value as string | undefined;
};

const validateCategory: FieldHook = ({ siblingData, value }): number | undefined => {
  const data = siblingData as { scope?: "order" | "category" };
  if (data.scope === "category" && !value) {
    return "A category is required when scope is Category." as unknown as number | undefined;
  }
  return value as number | undefined;
};

export const Promotion: CollectionConfig = {
  slug: "promotion",
  labels: {
    singular: "Promotion",
    plural: "Promotions",
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
      name: "applicationType",
      type: "select",
      label: "Application Type",
      required: true,
      options: [
        { label: "Automatic", value: "auto" },
        { label: "Code", value: "code" },
      ],
    },
    {
      name: "code",
      type: "text",
      label: "Code",
      unique: true,
      hooks: {
        beforeValidate: [validateCode],
      },
    },
    {
      name: "discountType",
      type: "select",
      label: "Discount Type",
      required: true,
      options: [
        { label: "Percent", value: "percent" },
        { label: "Fixed Amount", value: "fixed" },
      ],
    },
    {
      name: "value",
      type: "number",
      label: "Value",
      required: true,
      min: 0,
      max: 100_000,
    },
    {
      name: "scope",
      type: "select",
      label: "Scope",
      required: true,
      options: [
        { label: "Order", value: "order" },
        { label: "Category", value: "category" },
      ],
    },
    {
      name: "category",
      type: "relationship",
      label: "Category",
      relationTo: "category",
      hasMany: false,
      hooks: {
        beforeValidate: [validateCategory],
      },
    },
    {
      name: "validFrom",
      type: "date",
      label: "Valid From",
    },
    {
      name: "validUntil",
      type: "date",
      label: "Valid Until",
    },
    {
      name: "minOrderValue",
      type: "number",
      label: "Minimum Order Value (cents)",
      min: 0,
    },
    {
      name: "active",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
    },
  ],
};
