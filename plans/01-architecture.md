# 01 — Architecture

## Stack (locked)
- **Next.js 16** (App Router, Turbopack dev) + **React 19** + **TypeScript** (strict).
- **Payload CMS 3.x** — self-hosted *inside* the Next.js app via its Local API; `@payloadcms/db-postgres` adapter (Drizzle under the hood). Owns catalog + promotions.
- **Drizzle ORM** (`drizzle-orm` + `drizzle-kit`, `pg` driver) — transactional commerce truth (orders/payments/customers). Same Postgres database.
- **Stripe** — Checkout (hosted redirect) for payments; webhooks for confirmation/refund.
- **Resend** + **react-email** — the "ready for pickup" (and optional branded confirmation) email.
- **Zustand** (client cart, persisted to `localStorage`) + **Zod** (input validation).
- **Postgres: Neon** (serverless, dev-branching). **App: Vercel.**
- Existing tooling: `oxlint`, `oxfmt`, `husky`, `lint-staged`, `pnpm`.

Packages to add (agent to pin current 3.x/v latest):
```
payload @payloadcms/db-postgres @payloadcms/next
drizzle-orm drizzle-kit pg @types/pg
stripe @stripe/stripe-js
resend @react-email/components
zustand zod
```

## The Payload/Drizzle coexistence (THE Phase 0 risk — nail this first)
Both run against **one** Neon database. Two independent migration systems must
not collide.

- **One connection string** `DATABASE_URL` (Neon pooled endpoint `-pooler`).
  Share a single `pg.Pool` between Payload and Drizzle to bound connections.
- **Namespace the tables.** Commerce (Drizzle) tables live in a dedicated
  Postgres schema, e.g. `commerce`, via `pgSchema('commerce')`. Payload keeps its
  own tables (Payload prefixes them; optionally set a Payload table prefix /
  schema if the adapter supports it in the pinned version). **Verify the exact
  mechanism against the installed Payload version** — this is the first thing to
  confirm in Phase 0 before writing any feature code.
- **Two migration tracks, never crossed:**
  - Payload tables → `payload migrate` (Payload's own migrations).
  - Commerce tables → `drizzle-kit migrate` / `generate`.
- Treat cross-boundary references (e.g. `OrderLineItem.menuItemId` → a Payload
  `MenuItem` id) as **soft foreign keys** — no DB-level FK. Validate at write
  time, and **archive, never hard-delete** catalog items referenced by orders.

## Project layout (proposed)
```
payload.config.ts                      # Payload config: collections, db-postgres, admin path
src/payload/
  collections/                         # category, menuItem, modifierGroup, modifierOption,
                                       # dailyAvailability, promotion, storeSettings (global), media
src/db/
  schema/                              # drizzle schema (commerce schema): customers, orders,
                                       # order_line_items, payment_intents, webhook_events
  drizzle.config.ts
  migrations/
  client.ts                            # shared pg Pool + drizzle instance
src/lib/
  payload.ts                           # getPayload({ config }) helper
  checkout/                            # price-recompute, promotion-engine, tax-tip, slot-generation
  stripe.ts  resend.ts
app/
  (storefront)/
    page.tsx                           # hero + menu (Server Components, Payload Local API)
    cart/page.tsx
    checkout/page.tsx                  # review + pickup + contact + promo + tip
    checkout/success/route.ts          # Stripe success redirect
    checkout/cancel/route.ts
  (payload)/admin/...                  # Payload admin (mounted by @payloadcms/next)
  (owner)/
    orders/page.tsx                    # custom owner dashboard (Drizzle-backed, gated)
  api/
    stripe/webhook/route.ts            # Stripe webhook (signature verify + idempotent)
src/actions/
  checkout.ts                          # createOrder + createCheckoutSession (Server Action)
src/components/
  menu/  cart/  checkout/  orders/     # feature components using layout primitives
```
Route groups `(storefront)` / `(owner)` / `(payload)` keep layouts isolated.

## Owner dashboard protection (implementation decision — see open questions)
Customers are guest-only (no auth). The **owner** dashboard needs protection.
**Recommended:** reuse **Payload admin auth** to gate the custom `(owner)/orders`
route (the owner already logs into Payload to edit the menu). Read the Payload
session on the owner route and redirect if not authenticated. Fallback: a minimal
passphrase gate (`ADMIN_PASSPHRASE`) — only if Payload-session reuse proves hard.

## Environment variables (`.env.example` to commit; real values in Vercel/local `.env`)
```
DATABASE_URL=postgres://...            # Neon pooled connection (shared: Payload + Drizzle)
PAYLOAD_SECRET=...                     # Payload session/field-encryption secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
RESEND_API_KEY=re_...
FROM_EMAIL=orders@elquetzalito...
# optional, only if passphrase owner auth is used:
ADMIN_PASSPHRASE=...
```
Use **Stripe test mode** (`sk_test_` / `pk_test_`) throughout development; switch
keys at launch. Local webhook testing via `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
