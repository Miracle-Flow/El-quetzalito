const SPACING_KEYS = [
  "0",
  "0.5",
  "1",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "12",
  "14",
  "16",
  "20",
  "24",
] as const;

export const sizeTokens = Object.fromEntries(
  SPACING_KEYS.map((key) => [key, Number(key) * 4]),
) as Record<SpacingKey, number>;

export const radiusClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "4xl": "rounded-4xl",
} as const;

export type SpacingKey = (typeof SPACING_KEYS)[number];

function spacingClasses(prefix: string): Record<SpacingKey, string> {
  return Object.fromEntries(SPACING_KEYS.map((key) => [key, `${prefix}-${key}`])) as Record<
    SpacingKey,
    string
  >;
}

export const gapClasses = spacingClasses("gap");
export const gapXClasses = spacingClasses("gap-x");
export const gapYClasses = spacingClasses("gap-y");
export const paddingClasses = spacingClasses("p");
export const marginClasses = spacingClasses("m");
export const paddingXClasses = spacingClasses("px");
export const paddingYClasses = spacingClasses("py");
export const marginXClasses = spacingClasses("mx");
export const marginYClasses = spacingClasses("my");

export const _safelist = [
  "gap-0 gap-0.5 gap-1 gap-2 gap-2.5 gap-3 gap-4 gap-5 gap-6 gap-7 gap-8 gap-9 gap-10 gap-12 gap-14 gap-16 gap-20 gap-24",
  "gap-x-0 gap-x-0.5 gap-x-1 gap-x-2 gap-x-2.5 gap-x-3 gap-x-4 gap-x-5 gap-x-6 gap-x-7 gap-x-8 gap-x-9 gap-x-10 gap-x-12 gap-x-14 gap-x-16 gap-x-20 gap-x-24",
  "gap-y-0 gap-y-0.5 gap-y-1 gap-y-2 gap-y-2.5 gap-y-3 gap-y-4 gap-y-5 gap-y-6 gap-y-7 gap-y-8 gap-y-9 gap-y-10 gap-y-12 gap-y-14 gap-y-16 gap-y-20 gap-y-24",
  "p-0 p-0.5 p-1 p-2 p-2.5 p-3 p-4 p-5 p-6 p-7 p-8 p-9 p-10 p-12 p-14 p-16 p-20 p-24",
  "m-0 m-0.5 m-1 m-2 m-2.5 m-3 m-4 m-5 m-6 m-7 m-8 m-9 m-10 m-12 m-14 m-16 m-20 m-24",
  "px-0 px-0.5 px-1 px-2 px-2.5 px-3 px-4 px-5 px-6 px-7 px-8 px-9 px-10 px-12 px-14 px-16 px-20 px-24",
  "py-0 py-0.5 py-1 py-2 py-2.5 py-3 py-4 py-5 py-6 py-7 py-8 py-9 py-10 py-12 py-14 py-16 py-20 py-24",
  "mx-0 mx-0.5 mx-1 mx-2 mx-2.5 mx-3 mx-4 mx-5 mx-6 mx-7 mx-8 mx-9 mx-10 mx-12 mx-14 mx-16 mx-20 mx-24",
  "my-0 my-0.5 my-1 my-2 my-2.5 my-3 my-4 my-5 my-6 my-7 my-8 my-9 my-10 my-12 my-14 my-16 my-20 my-24",
].join(" ");
