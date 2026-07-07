# el-quetzalito Design System

Source of truth for the el-quetzalito design system. Code-level tokens live in
`app/globals.css` and `lib/tokens.ts`; component primitives live in `components/`.
This document defines intent, usage, and the canonical scale.

> **Palette lineage:** Mirrors the storywonderbook rose/red brand identity.
> Primary is rose (brand-500), tertiary is yellow, neutrals are true gray.

---

## 1. Color

### Brand scale (rose)

The primary action color. Built on a single rose hue ramp.

| Token        | OKLCH                       | Hex approx | Use                          |
| ------------ | --------------------------- | ---------- | ---------------------------- |
| brand-100    | `oklch(0.9414 0.0298 12.58)` | `#FECDD3`  | sidebar-accent-foreground    |
| brand-300    | `oklch(0.8097 0.1061 11.64)` | `#FBA5AE`  | chart-1, sidebar-border      |
| brand-400    | `oklch(0.7192 0.169 13.43)`  | `#F87171`  | chart-2                      |
| **brand-500**| `oklch(0.645 0.2154 16.44)`  | `#E11D48`  | **primary**, chart-3         |
| brand-600    | `oklch(0.5858 0.222 17.58)`  | `#C81E40`  | chart-4, sidebar-accent      |
| brand-700    | `oklch(0.5143 0.1978 16.93)` | `#A51733`  | sidebar-primary              |
| brand-800    | `oklch(0.4546 0.1713 13.7)`  | `#831838`  | sidebar bg, chart-5          |

### Semantic roles (light)

| Role          | Value                        | Meaning                          |
| ------------- | ---------------------------- | -------------------------------- |
| `background`  | white                        | page                             |
| `foreground`  | neutral-600                  | default body text                |
| `card`        | white                        | card surfaces                    |
| `card-foreground` | neutral-700              | card text                        |
| `popover`     | white                        | menus, popovers                  |
| `popover-foreground` | neutral-700             | popover text                     |
| **`primary`** | brand-500                    | primary actions, links, focus    |
| `primary-foreground` | white                  | text on primary                  |
| `secondary`   | neutral-50                   | secondary surfaces               |
| `secondary-foreground` | neutral-800             | text on secondary                |
| **`tertiary`**| yellow-400 `oklch(0.86 0.18 95)` | highlight, accent fills       |
| `tertiary-foreground` | neutral-900             | text on tertiary                 |
| `muted`       | neutral-100                  | muted surfaces                   |
| `muted-foreground` | neutral-500              | secondary text, captions         |
| `accent`      | neutral-200                  | hover, active rows               |
| `accent-foreground` | white                   | text on accent                   |
| `destructive` | red-500                      | destructive actions, errors      |
| `border`      | neutral-200                  | hairline borders                 |
| `input`       | neutral-300                  | input borders                    |
| `ring`        | rose-tinted                  | focus rings                      |

### Semantic roles (dark)

| Role          | Value                                   |
| ------------- | --------------------------------------- |
| `background`  | `oklch(0 0 0)` pure black               |
| `foreground`  | `oklch(0.9328 0.0025 228.7857)`         |
| `card`/`popover` | `oklch(0.205 0 0)`                  |
| `primary`     | `oklch(0.87 0 0)` (inverted)            |
| `tertiary`    | `oklch(0.75 0.16 95)` yellow-500        |
| `muted`/`secondary` | `oklch(0.269 0 0)`                |
| `border`      | `oklch(1 0 0 / 10%)` white-10           |
| `input`       | `oklch(1 0 0 / 15%)` white-15           |

### Chart ramp

Light charts use the brand rose ramp (brand-300 → brand-800). Dark charts shift
to a blue hue ramp for vibrancy against black (`oklch` hues ~251–266).

### Sidebar

Light: brand-800 background with brand-100 text — a deliberate dark brand panel
for navigation emphasis. Dark: neutral surface with white-10 borders.

---

## 2. Typography

### Font families

| Token            | Font   | Use                          |
| ---------------- | ------ | ---------------------------- |
| `--font-sans`    | Geist  | body, UI                     |
| `--font-mono`    | Geist Mono | code, monospace          |
| `--font-heading` | Geist  | headings (same as sans)      |

### Type scale (Typography component)

| Variant  | Size / line-height / tracking         | Semantic use            |
| -------- | ------------------------------------- | ----------------------- |
| `h1`     | `text-7xl / leading-22.5 / tracking-tight` | hero display        |
| `h2`     | `text-6xl / leading-18`               | section headline        |
| `h3`     | `text-5xl / leading-15`               | subsection              |
| `h4`     | `text-4xl / leading-11` *(renders h2)*| card / panel title      |
| `h5`     | `text-3xl / leading-9.5`              | tertiary heading        |
| `h6`     | `text-2xl / leading-8`                | minor heading           |
| `text-xl`| `text-xl / leading-7.5`               | lead paragraph          |
| `text-lg`| `text-lg / leading-7`                 | large body              |
| `text-md`| `text-base / leading-6`               | default body            |
| `text-sm`| `text-sm / leading-5`                 | secondary text, labels  |
| `text-xs`| `text-xs / leading-4.5`               | caption, metadata       |

Weights: `bold` · `semibold` · `medium` · `regular`.
Align: `left` · `center` · `right`.
Transform: `uppercase` · `lowercase` · `capitalize`.
Text color: foreground · background · primary · sidebar · text-secondary · muted · destructive · inherit · popover.

> Prefer `<Typography variant="...">` over raw `<h1>`/`<p>`. Use `as` to
> override the element without changing visual style (e.g. h4 renders as h2
> for accessible document outline).

---

## 3. Spacing

Base unit: **4px**. All layout spacing props take design-scale **keys** (string
numbers), never raw pixel values.

| Key    | px    | Key    | px    | Key   | px     |
| ------ | ----- | ------ | ----- | ------| ------ |
| `"0"`  | 0     | `"4"`  | 16    | `"12"`| 48     |
| `"0.5"`| 2     | `"5"`  | 20    | `"14"`| 56     |
| `"1"`  | 4     | `"6"`  | 24    | `"16"`| 64     |
| `"2"`  | 8     | `"7"`  | 28    | `"20"`| 80     |
| `"2.5"`| 10    | `"8"`  | 32    | `"24"`| 96     |
| `"3"`  | 12    | `"9"`  | 36    |        |        |
|        |       | `"10"` | 40    |        |        |

Spacing props: `p`, `px`, `py`, `gap`, `gapX`, `gapY`, and the same set for
margins (`m`, `mx`, `my`). All accept only keys from the table above.

---

## 4. Radius

Additive scale from a base of `--radius: 0.625rem` (10px). Each step is the
base ± a fixed px offset (shadcn standard).

| Token       | Formula                  | ≈ px | Use                  |
| ----------- | ------------------------ | ---- | -------------------- |
| `sm`        | `radius - 4px`           | 6    | badges, chips        |
| `md`        | `radius - 2px`           | 8    | inputs, buttons-sm   |
| `lg`        | `= radius`               | 10   | buttons, default     |
| `xl`        | `radius + 4px`           | 14   | cards                |
| `2xl`       | `radius + 6px`           | 16   | popovers             |
| `3xl`       | `radius + 12px`          | 22   | large cards          |
| `4xl`       | `radius + 16px`          | 26   | modals, sheets       |

`Box` radius prop keys: `none | sm | md | lg | xl | 2xl | 3xl | 4xl`.

---

## 5. Elevation

Shadows are not currently exposed as design tokens (parity with reference
system). Use Tailwind's default `shadow-sm/md/lg/xl/2xl` utilities until a
dedicated elevation scale is introduced.

---

## 6. Layout primitives

| Component  | Purpose                                           |
| ---------- | ------------------------------------------------- |
| `Section`  | full-width page band; variant `default \| muted \| secondary \| inverted \| primary`, `spacing`, `as` |
| `Container`| max-width wrapper; size `sm \| md \| lg \| xl \| 2xl \| full`, `align`, `spacing` |
| `Flex`     | flex container; `direction`, `align`, `justify`, `wrap`, `gap` |
| `Stack`    | `Flex direction="col"` shorthand                  |
| `Cluster`  | `Flex direction="row"` shorthand                  |
| `Grid`     | responsive grid; `cols 1-6` responsive, `gap/gapX/gapY`, `height/width` |
| `Box`      | generic block; `p/px/py/gap`, `radius`, `bg: none \| muted \| white \| card \| primary \| secondary`, `as` |
| `Spacer`   | flex-grow filler (`flex: 1`)                      |

---

## 7. Icons

Icons use the **`IconToken`** pattern via the `t(...)` translator, not direct
lucide imports.

- Token wraps either a **Lucide component** or an **SVG asset** `{ src }`.
- Render with `<RenderIcon icon={...} size={24} className="text-primary" />`.
- Recoloring: Lucide uses `currentColor`; SVG assets use CSS `mask` (single-color only).

**Never import `lucide-react` directly in feature or page code.** Always go
through `IconToken` + `RenderIcon` so icons stay swappable and tree-shakeable.

---

## 8. Usage rules

1. **Spacing keys only.** Layout props (`p`, `gap`, `px`, …) take string keys
   from the spacing table, never raw `px`/rem/Tailwind classes.
2. **Typography component over raw tags.** Use `<Typography variant="...">` for
   all text; override semantics with `as`.
3. **Icons via tokens.** `IconToken` + `RenderIcon`, never direct lucide imports.
4. **Brand colors via semantic tokens.** Reference `bg-primary`, `text-muted-foreground`,
   etc. — not raw hex or oklch in components.
5. **Radius via the additive scale.** Use `radius` prop keys on `Box`, or the
   `rounded-{sm..4xl}` utilities that map to the scale.
