# Components

Before writing raw `<div className="...">` markup or importing `lucide-react` directly, read [`COMPONENTS.md`](./COMPONENTS.md). It documents the project's layout primitives (`Section`, `Container`, `Flex`/`Stack`/`Cluster`, `Grid`, `Box`, `Spacer`), the `Typography` text component, and the icon token + `RenderIcon` pattern. Use these instead.

Key rules:
- Spacing props take a design-scale key (`"0" "0.5" "1" "2" "2.5" "3" … "24"`), not arbitrary values. Each key = `key * 4px`.
- Always route icons through `@/components/icons` tokens and render with `<RenderIcon icon={...} />`. Never import `lucide-react` in feature/page code.
- Prefer `Typography` over raw heading/paragraph tags.

# Design

Before introducing colors, type sizes, spacing, or radius, read [`DESIGN.md`](./DESIGN.md). It is the source of truth for the design system (rose brand palette, semantic color roles, type scale, 4px spacing base, additive radius scale, layout primitives, icon tokens).

Key rules:
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`, `bg-tertiary`) — never raw hex or oklch in components.
- Spacing/radius follow fixed scales defined in DESIGN.md (spacing keys × 4px; radius additive from `--radius: 0.625rem`).
