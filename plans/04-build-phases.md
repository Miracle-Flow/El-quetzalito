# 04 — Build Phases

Dependency-ordered. Each phase lists **deliverables** and a **definition of
done**. Run `pnpm typecheck && pnpm lint && pnpm build` after every phase.

## ⚡ Tracer bullet FIRST (de-risk before building breadth)
A thin vertical slice end-to-end, with hardcoded data where needed:
- One Payload `MenuItem` (no modifiers) seeded.
- Add-to-cart → cart page → simple checkout form → **Stripe Checkout Session
  (test mode)** → `stripe listen` webhook → `orders` row flips `pending_payment → paid`.
Goal: prove the Payload/Drizzle/Stripe wiring on Neon before fleshing out the
catalog, modifiers, promotions, scheduling, and dashboard. Do this in Phase 0→5
minimal form, then expand.

---

## Phase 0 — Foundations & coexistence
**Deliverables**
- Add packages (see `01-architecture.md`); wire `next.config.ts` with Payload.
- Provision Neon DB; set `.env.example` + local `.env`.
- Payload config (`payload.config.ts`, `@payloadcms/db-postgres`, admin mounted at
  `/(payload)/admin`). **Confirm table-namespace separation** between Payload and
  the Drizzle `commerce` schema (the #1 risk) — verify against the installed
  Payload version.
- Shared `pg.Pool` + Drizzle client (`src/db/client.ts`); `drizzle.config.ts`.
**DoD:** Payload admin loads; a throwaway Payload collection + a throwaway
Drizzle table both migrate cleanly in the same DB without collision.

## Phase 1 — Catalog (Payload) + menu browsing
**Deliverables**
- Payload collections: `Menu`, `Category`, `MenuItem`, `ModifierGroup`,
  `ModifierOption`, `DailyAvailability`, `Media`, `StoreSettings` (global).
- Seed a realistic Guatemalan menu (platos fuertes, sopas, bebidas, postres) with
  a couple of modifier groups (spice level, choose-your-sides).
- Storefront menu page (Server Components via Local API) with categories, items,
  sold-out badges, and an open/closed header status.
**DoD:** Owner can edit the menu in Payload admin; storefront renders it with
correct availability; a steam-table item marked `soldOut` for today is disabled.

## Phase 2 — Cart + modifiers UX (client only)
**Deliverables**
- Zustand cart store + `localStorage` persistence.
- Item customization UI (modifier group selection; pick-one/pick-many, required/min/max).
- Cart drawer/page with quantities, provisional totals, remove/edit.
**DoD:** A guest can build a cart with modifiers; it survives refresh; totals are
clearly provisional. No server pricing yet.

## Phase 3 — Checkout computation + pickup (no payment yet)
**Deliverables**
- `src/lib/checkout/`: `price-recompute`, `promotion-engine`, `tax-tip`,
  `slot-generation` (Zod input schemas throughout).
- Checkout page: pickup mode/slot selector (Flow H), contact capture, promo code,
  tip selector; a "review order" summary computed server-side.
**DoD:** Server recomputes a full quote (subtotal, discount, tax, tip, total)
from the cart and rejects invalid/sold-out items; slots render correctly within
today's hours; promo validation works.

## Phase 4 — Orders (Drizzle) + order-first
**Deliverables**
- Drizzle schema (`commerce`): `customers`, `orders`, `order_line_items`,
  `payment_intents`, `webhook_events`; migration.
- Server Action stub that creates the order transaction (`pending_payment`) with
  frozen line snapshots (no Stripe yet).
**DoD:** Submitting checkout creates an order + line items + pending payment
intent in one transaction with correct totals and `order_number`.

## Phase 5 — Stripe integration
**Deliverables**
- `src/lib/stripe.ts`; Checkout Session creation in the checkout action (Flow C).
- `success`/`cancel` routes; webhook route (Flow D) with signature verify +
  idempotency (`webhook_events`) + `pending_payment → paid` transition.
- Stripe CLI local forwarding; test-mode checkout (real test card) succeeds and
  flips the order.
**DoD:** End-to-end test purchase creates a paid order; duplicate webhook
delivery is a no-op; refund flips the order to `canceled`.

## Phase 6 — Owner dashboard + lifecycle
**Deliverables**
- `(owner)/orders` dashboard (Drizzle-backed), gated by Payload admin auth (Flow E).
- Actions: mark ready (→ email), mark completed, cancel (+ Stripe refund).
- Stale `pending_payment` cleanup (session-expiry).
**DoD:** Owner sees incoming orders, marks ready/completed, cancels-with-refund;
state transitions are guarded.

## Phase 7 — Notifications
**Deliverables**
- Resend client + react-email "ready for pickup" template; optional branded
  confirmation. Triggered on `paid → ready`.
**DoD:** Marking an order ready sends the email to the customer's address.

## Phase 8 — Promotions polish (owner-facing)
**Deliverables**
- `Promotion` collection fully usable from Payload admin; verify auto-sales +
  codes both apply correctly at checkout (already built in Phase 3 engine).
**DoD:** Owner creates a weekend category sale + a code; both reflect correctly
in a test order; no-stacking holds.

## Phase 9 — Polish, edge states, deploy
**Deliverables**
- Handle: sold-out mid-checkout, store-closed mid-checkout, payment failure,
  webhook-before-redirect (success page reads DB status).
- Bilingual content entry pass (Spanish names + English descriptions).
- Deploy to Vercel + Neon prod; configure prod env + Stripe webhook endpoint;
  switch to live Stripe keys; smoke-test a real low-value order.
**DoD:** A real pickup order completes in production end-to-end; owner manages it
in the dashboard; customer gets the ready email.

---

## Open implementation questions (confirm before/while building)
1. **Payload/Drizzle table separation mechanism** — verify the exact config
   (schema vs prefix) for the installed Payload version. (Phase 0 blocker.)
2. **Owner dashboard auth** — reuse Payload admin session (recommended) vs a
   minimal passphrase gate. Confirm in Phase 6.
3. **`order_number` format** — global sequence (`EQ-1042`) vs daily
   (`EQ-YYYYMMDD-NN`). Either fine; pick one.
4. **Stripe Checkout itemization** — single total line vs itemized lines + tax/tip/
   discount adjustments. Use whatever is cleanest in the pinned Stripe version.
5. **Cleanup strategy for `pending_payment` orders** — cron/queue job vs lazy
   expiry on read. Decide by what Vercel scheduling (cron) offers at build time.

Everything else is locked in `CONTEXT.md` and the three ADRs — do not re-decide.
