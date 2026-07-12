# El Quetzalito — Implementation Plan

This directory is the handoff for an agent implementing **online ordering for El
Quetzalito**, a Guatemalan / Central American restaurant with a daily steam
table.

## What we're building
A **pickup** online-ordering system: menu (catalog), cart, checkout, Stripe
payments, and an owner dashboard — backed by **Payload CMS** for the menu and
promotions, and a **Drizzle** layer for transactional orders/payments.

## Read these first (source of truth — do not re-litigate)
- `../CONTEXT.md` — domain glossary / ubiquitous language. Authoritative for terms.
- `../docs/adr/0001-payload-catalog-drizzle-commerce.md` — CMS choice + data boundary.
- `../docs/adr/0002-stripe-checkout-order-first-guest.md` — payments + checkout + guest-only.
- `../docs/adr/0003-vercel-neon-deployment.md` — deployment + DB hosting.

If you believe a locked decision is wrong, **raise it as a question** rather than
silently diverging.

## Plan documents (read in order)
1. `01-architecture.md` — stack, the Payload/Drizzle coexistence (the #1 Phase 0 risk), project layout, env vars.
2. `02-data-model.md` — Payload collections + Drizzle tables (fields, types, money in cents).
3. `03-request-flows.md` — end-to-end sequences (browse, checkout, webhook, lifecycle, slots, availability).
4. `04-build-phases.md` — phased delivery with deliverables + verification. **Start with the tracer bullet.**
5. `05-cms-cart-checkout-bridge.md` — **NEXT UP:** CMS cart IDs + porting `feat/checkout` onto current `feat/ordering`. Read this before implementing checkout on the post-main ordering branch.

## How to work (non-negotiable conventions)
- Follow `../AGENTS.md`, `../COMPONENTS.md`, `../DESIGN.md`.
- Layout: use `@/components/layout` primitives (`Section`/`Container`/`Flex`/`Stack`/`Cluster`/`Grid`/`Box`/`Spacer`), `Typography` from `@/components/typography`, and `<RenderIcon icon={...}/>` from `@/components/icons`. **Never** import `lucide-react` in feature code. **Never** raw hex/oklch.
- Spacing props take design-scale keys (`"0" "0.5" "1" … "24"`, each = key × 4px). Colors via semantic tokens only.
- **Money is always integer cents** (e.g. `1250` = $12.50). Stripe also uses cents — consistent.
- **Dates/times** stored as `timestamptz` (UTC); render in the restaurant's timezone (set in StoreSettings).
- **Trust boundary:** the server recomputes every price from the catalog at checkout. **Never trust client-supplied prices.**
- Verify after each phase: `pnpm typecheck && pnpm lint && pnpm build`.
- Don't commit secrets. Commit only `.env.example`.

## Out of scope (phase 2 — do NOT build)
delivery · dine-in / QR table ordering · catering · customer accounts + loyalty + reorder · free-item / BOGO promotions · SMS notifications · future-day scheduling + preorder menu · per-item prep times · per-slot capacity throttling · partial refunds · ES/EN locale switcher.
