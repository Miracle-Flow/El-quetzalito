# Components

A small set of primitive components that should be preferred over raw `<div className="...">` markup. They keep spacing, color, and typography on the design-system scale (defined in `lib/tokens.ts`) instead of ad-hoc Tailwind values.

- `components/layout.tsx` — structural primitives (`Section`, `Container`, `Flex`, `Stack`, `Cluster`, `Grid`, `Box`, `Spacer`)
- `components/typography.tsx` — `Typography` text component
- `components/icons.tsx` + `components/render-icon.tsx` — icon token registry and renderer

All spacing props (`gap`, `p`, `px`, `py`, `spacing`, etc.) accept a **spacing key** from the design scale, not a raw Tailwind class:

```
"0" "0.5" "1" "2" "2.5" "3" "4" "5" "6" "7" "8" "9" "10" "12" "14" "16" "20" "24"
```

Each key maps to `key * 4px` (so `"6"` = `24px`, `"2.5"` = `10px`). Never pass arbitrary numbers or class strings to these props — use `className` for anything off-scale.

---

## Layout primitives — `@/components/layout`

### `Section` — full-width horizontal band

Top-level page section. Sets background/text color variant and vertical padding.

```tsx
import { Section } from "@/components/layout";

<Section variant="muted" spacing="16" as="section">
  ...
</Section>
```

| Prop      | Values                                                               | Default     |
| --------- | -------------------------------------------------------------------- | ----------- |
| `variant` | `default` \| `muted` \| `secondary` \| `inverted` \| `primary`       | `default`   |
| `spacing` | spacing key (vertical padding `py`)                                  | `"0"`       |
| `as`      | `ElementType`                                                        | `"section"` |

### `Container` — centered max-width wrapper

Constrains content width and adds horizontal padding. Nest it inside `Section`.

```tsx
<Section variant="default">
  <Container size="xl" spacing="6">
    ...
  </Container>
</Section>
```

| Prop      | Values                                              | Default  |
| --------- | --------------------------------------------------- | -------- |
| `size`    | `sm` \| `md` \| `lg` \| `xl` \| `2xl` \| `full`     | `xl`     |
| `align`   | `left` \| `center` \| `right`                       | `center` |
| `spacing` | spacing key (horizontal padding `px`)               | `"0"`    |

### `Flex` — flexbox shortcut

```tsx
<Flex direction="row" align="center" justify="between" gap="4">
  ...
</Flex>
```

| Prop       | Values                                                                                     | Default |
| ---------- | ------------------------------------------------------------------------------------------ | ------- |
| `direction`| `row` \| `col`                                                                             | `col`   |
| `align`    | `start` \| `center` \| `end` \| `baseline` \| `stretch`                                   | `center`|
| `justify`  | `start` \| `center` \| `end` \| `between` \| `around` \| `evenly`                         | `start` |
| `wrap`     | `boolean`                                                                                  | `false` |
| `gap`      | spacing key                                                                                | `"2.5"` |
| `as`       | `ElementType`                                                                              | `"div"` |

### `Stack` and `Cluster` — opinionated `Flex` shortcuts

- `Stack` = `Flex` forced to `direction="col"` (vertical layout)
- `Cluster` = `Flex` forced to `direction="row"` (horizontal layout)

```tsx
<Stack align="start" gap="3">...</Stack>
<Cluster gap="2" wrap>...</Cluster>
```

They take every `Flex` prop **except** `direction`.

### `Grid` — responsive column grid

Column counts auto-respond at `sm` and `lg` breakpoints.

```tsx
<Grid cols={3} gap="4">
  <Card />
  <Card />
  <Card />
</Grid>
```

| Prop    | Values                                | Default |
| ------- | ------------------------------------- | ------- |
| `cols`  | `1` \| `2` \| `3` \| `4` \| `5` \| `6` | `3`     |
| `gap`   | spacing key                           | —       |
| `gapX`  | spacing key                           | —       |
| `gapY`  | spacing key                           | —       |
| `height`| inline style value (string)           | —       |
| `width` | inline style value (string)           | —       |

### `Box` — padded/radius/background box

General-purpose surface. Use when you need padding + background + radius in one place.

```tsx
<Box bg="card" p="6" radius="xl">
  ...
</Box>
```

| Prop     | Values                                                                       | Default |
| -------- | ---------------------------------------------------------------------------- | ------- |
| `p`      | spacing key (all-side padding)                                               | —       |
| `px`     | spacing key                                                                  | —       |
| `py`     | spacing key                                                                  | —       |
| `gap`    | spacing key                                                                  | —       |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `xl` \| `2xl` \| `3xl` \| `4xl`            | —       |
| `bg`     | `none` \| `muted` \| `white` \| `card` \| `primary` \| `secondary`          | `none`  |
| `as`     | `ElementType`                                                                | `"div"` |

### `Spacer` — flexible gap inside `Flex`/`Cluster`

Pushes siblings apart. Pass `grow={false}` for a fixed empty block.

```tsx
<Cluster>
  <Logo />
  <Spacer />
  <Avatar />
</Cluster>
```

| Prop    | Default | Notes                                  |
| ------- | ------- | -------------------------------------- |
| `grow`  | `true`  | Adds `grow` class                       |

---

## Typography — `@/components/typography`

Single component for every text style. The rendered tag follows the chosen variant unless you override with `as` or `render`.

```tsx
import { Typography } from "@/components/typography";

<Typography variant="h1" weight="bold">El Quetzalito</Typography>
<Typography variant="text-lg" textColor="muted">Subtitle copy</Typography>
<Typography variant="text-sm" align="center" transform="uppercase">Label</Typography>
```

| Prop        | Values                                                                                      | Default    |
| ----------- | ------------------------------------------------------------------------------------------- | ---------- |
| `variant`   | `h1`–`h6` \| `text-xl` \| `text-lg` \| `text-md` \| `text-sm` \| `text-xs`                  | `text-md`  |
| `weight`    | `regular` \| `medium` \| `semibold` \| `bold`                                               | `regular`  |
| `align`     | `left` \| `center` \| `right` \| `justify`                                                  | `left`     |
| `transform` | `normal` \| `uppercase` \| `lowercase` \| `capitalize`                                      | `normal`   |
| `textColor` | `foreground` \| `background` \| `primary` \| `muted` \| `secondary` \| `destructive` \| `sidebar` \| `popover` \| `inherit` | `foreground` |
| `as`        | `ElementType`                                                                               | mapped from `variant` |
| `render`    | `ReactElement` (base-ui render prop, see below)                                             | —          |

Type scale (variant → size / leading):

| Variant   | Size     | Leading |
| --------- | -------- | ------- |
| `h1`      | `7xl`    | 22.5    |
| `h2`      | `6xl`    | 18      |
| `h3`      | `5xl`    | 15      |
| `h4`      | `4xl`    | 11      |
| `h5`      | `3xl`    | 9.5     |
| `h6`      | `2xl`    | 8       |
| `text-xl` | `xl`     | 7.5     |
| `text-lg` | `lg`     | 7       |
| `text-md` | `base`   | 6       |
| `text-sm` | `sm`     | 5       |
| `text-xs` | `xs`     | 4.5     |

> Note: `h4` renders as `<h2>` by default (likely an SEO-heading-level fix). Override with `as="h4"` if you need a real `h4`.

### Polymorphic rendering (`render`)

`Typography` is built on `@base-ui/react/use-render`, so you can render it as another component while keeping its styles. Prefer `as` for simple tag swaps and reserve `render` for composing with custom components:

```tsx
<Typography variant="h3" render={<NextLink href="/about" />}>About</Typography>
```

---

## Icons — `@/components/icons` + `@/components/render-icon`

Icons use a **token pattern** rather than importing Lucide components directly. A token is a branded wrapper (`IconToken`) around either a Lucide component or a local SVG asset. This indirection lets the renderer swap recoloring strategies (Lucide `currentColor` vs. CSS-mask for `.svg` files) without the call site caring.

### 1. Pick a token from `icons.tsx`

```tsx
import { RocketIcon, ArrowRight, LogoIcon } from "@/components/icons";
```

Existing tokens include navigation/feature names (`Home`, `Dashboard`, `Projects`, `Tasks`, `Reporting`, `Users`, `Support`, `Settings`, `Book`, `Collage`, `FaceSwap`, etc.) and generic UI icons suffixed with `Icon` (`ArrowRight`, `BellIcon`, `CheckIcon`, `Trash2Icon`, `CloseIcon`, `SidebarIcon`, …). Always reuse an existing token before adding a new one.

### 2. Render it with `RenderIcon`

```tsx
import { RenderIcon } from "@/components/render-icon";
import { RocketIcon } from "@/components/icons";

<RenderIcon icon={RocketIcon} size={24} className="text-primary" />
```

| Prop         | Type                  | Default | Notes                                                                                          |
| ------------ | --------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `icon`       | `IconToken` (required)| —       | A token exported from `@/components/icons`                                                      |
| `size`       | `number \| string`    | `24`    | Pixel size (both width & height)                                                                |
| `className`  | `string`              | —       | Use text-color utilities (`text-primary`, `text-muted-foreground`, …) to recolor                |
| `strokeWidth`| `number \| string`    | —       | Lucide stroke width (ignored for SVG assets)                                                    |
| `fill`       | `boolean`             | —       | Set `fill="currentColor"` on Lucide icons (ignored for SVG assets)                              |

Color is controlled by `currentColor` — set it via a text-color utility on `className` (or inherit from a parent like `<div className="text-primary">`).

### 3. Adding a new icon

Add the import and a token in `components/icons.tsx`:

```tsx
// 1. import the Lucide component (prefix the local alias with _ to avoid name clashes)
import { Ghost as _Ghost } from "lucide-react";

// 2. register a token with t(...)
export const GhostIcon = t(_Ghost);
```

For a local `.svg` file, register an `SvgAsset` instead — the renderer will mask it so `currentColor` recolors the glyph (single-color only):

```tsx
export const MyMark = t({ src: "/my-mark.svg" });
```

Both forms are then rendered identically through `<RenderIcon icon={MyMark} />`.

### Don't

- Don't import `lucide-react` directly in feature/page code — go through `components/icons.tsx`.
- Don't construct `IconToken` objects outside `icons.tsx`; use `t(...)` only at the registry layer.
- Don't pass raw `<svg>` markup to components expecting an `IconToken`.

---

## Putting it together

```tsx
import { Container, Stack, Cluster } from "@/components/layout";
import { Typography } from "@/components/typography";
import { RenderIcon } from "@/components/render-icon";
import { ArrowRight, RocketIcon } from "@/components/icons";

export default function Page() {
  return (
    <Container size="xl" spacing="6">
      <Stack align="start" gap="4" className="py-16">
        <Typography variant="h1" weight="bold">Ship it</Typography>
        <Typography variant="text-lg" textColor="muted">
          Build faster with primitives that stay on the design scale.
        </Typography>
        <Cluster gap="2" className="text-primary">
          <RenderIcon icon={RocketIcon} size={20} />
          <Typography variant="text-md" weight="semibold" textColor="primary">
            Ready to ship
          </Typography>
          <RenderIcon icon={ArrowRight} size={16} />
        </Cluster>
      </Stack>
    </Container>
  );
}
```
:root {
  --color-50: oklch(0.95 0.022 261.349);
  --color-100: oklch(0.884 0.053 261.349);
  --color-200: oklch(0.817 0.085 261.349);
  --color-300: oklch(0.751 0.119 261.349);
  --color-400: oklch(0.685 0.155 261.349);
  --color-500: oklch(0.619 0.192 261.349);
  --color-600: oklch(0.539 0.222 261.349);
  --color-700: oklch(0.459 0.189 261.349);
  --color-800: oklch(0.379 0.156 261.349);
  --color-900: oklch(0.299 0.123 261.349);
  --color-950: oklch(0.219 0.09 261.349);
}
