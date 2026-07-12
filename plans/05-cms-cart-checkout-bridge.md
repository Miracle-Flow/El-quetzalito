# 05 — CMS cart IDs + checkout bridge (implementation handoff)

**Status:** Ready to implement  
**Branch base:** `feat/ordering` @ `b1418e2` (main already merged)  
**Owner for next agent:** implement P0→P6 below in order; do not skip P1–P3 before full checkout submit.

This plan unblocks porting `feat/checkout` onto current `feat/ordering` so server-side **quote recompute** validates cart lines against real Payload catalog IDs.

---

## 0. Read first (do not re-litigate)

| Doc | Why |
|-----|-----|
| `CONTEXT.md` | Domain language |
| `docs/adr/0001-payload-catalog-drizzle-commerce.md` | CMS owns catalog; Drizzle owns orders |
| `docs/adr/0002-stripe-checkout-order-first-guest.md` | Order-first + Stripe Checkout + guest-only |
| `plans/03-request-flows.md` | Flow A browse, B cart, C checkout recompute |
| `plans/04-build-phases.md` | Phase 2–5 context (cart → quote → Stripe) |
| `AGENTS.md`, `COMPONENTS.md`, `DESIGN.md` | UI/system rules |

### Non-negotiable product invariants

1. **Money is integer cents** everywhere (cart, quote, DB, Stripe).
2. **Trust boundary:** server recomputes every price from Payload at quote/checkout. Never trust client prices for totals.
3. **`CartItemSnapshot.id` MUST be a Payload `menu-item` document id.** Never a hash of a slug.
4. Join key between marketing static data and CMS: **`MenuItem.slug`** (unique + indexed).

---

## 1. Current state (as of `b1418e2`)

### What works on `feat/ordering`

- Marketing site: `/`, `/menu` (static TS menu under `features/restaurant/menu/`)
- Cart store: `src/store/cart.ts` (+ tests)
- Configurator / modifiers UI: `components/menu-item-configurator.tsx`, `modifier-selector*.ts(x)`
- Navbar cart trigger: `CartTrigger` `variant="navbar"`
- Storefront chrome: `app/(storefront)/layout.tsx` (cart page)
- Menu helpers: `lib/menu-helpers.ts` (formatPrice expects **cents**)
- Payload collections + seed + commerce Drizzle schema exist
- `pnpm lint:fix` clean; marketing pages may only import `@/features/marketing/**` (barrels re-export restaurant)

### Critical bug / gap

```
features/restaurant/menu/data/*.ts  (slug + price in dollars)
        → to-orderable-item.ts  id = stableId(slug)  // FAKE
        → cart.itemSnapshot.id = hash
        → getQuote / recomputePrice(catalog.get(id))  // MISS
        → "Item is no longer available"
```

File: `features/restaurant/menu/to-orderable-item.ts`  
Static menu: ~125 slugs, ~107 fixed `price`s, ~11 `priceLabel`-only (not orderable until CMS has fixed cents or size modifiers).

Seed (`src/payload/seed.ts`) is a **demo** catalog (~15 items, different slugs like `pepian`, not marketing slugs like `parrillada-chapina`).

### What lives only on `feat/checkout` (not yet on ordering)

Two commits, pure additive, cherry-pick cleanly onto `b1418e2` (verified dry-run):

| Commit | Contents |
|--------|----------|
| `3a0d893` | `src/lib/checkout/*` quote/promo/tax/slot logic + tests (~1.7k lines) |
| `44a1388` | `app/(storefront)/checkout/page.tsx`, `app/actions/checkout.ts`, `src/components/checkout/*` (~1.3k lines) |

### Broken deps if you cherry-pick UI naively onto ordering

| Dep | Status on ordering |
|-----|-------------------|
| `components/ui/input` | **Deleted** (prune) — restore or use native inputs |
| Icons: `UserIcon`, `PhoneIcon`, `EnvelopeIcon`, `CalendarIcon`, `ClockIcon`, `SparklesIcon`, `HeartIcon` | **Missing** from slim `components/icons.tsx` |
| `@/app/menu-helpers` | Re-exports from `lib/menu-helpers` — prefer `@/lib/menu-helpers` |
| `src/lib/stripe.ts` | **Only on `feat/payments`** — needed for `submitCheckout` only |
| Cart → `/checkout` | Already default `checkoutHref = "/checkout"` in cart-summary |

`order-details.tsx` is used by **payments** success/cancel pages, not by the checkout form. Ship with checkout or wait for payments.

---

## 2. Target architecture

```
Marketing presentation (photos, i18n, layout)
        │  join: slug
        ▼
Payload catalog (authoritative)
  MenuItem.id, basePrice cents, categoryId,
  availabilityType, active, modifierGroups → options
        │  add to cart
        ▼
Zustand cart
  itemSnapshot.id = Payload MenuItem.id   ← ONLY real IDs
  basePrice/name = display snapshot (revalidated server-side)
  modifiers: optionId parseable (see below)
        │  checkout
        ▼
getQuote / submitCheckout
  loadStoreContext() from Payload Local API
  recomputePrice → promo → tax/tip → slots
```

### Modifier id convention (already assumed by checkout form)

Checkout maps cart modifiers like this (from `feat/checkout` form):

```ts
const optionId = Number(modifier.id.split(":").at(-1));
```

So when adding modifiers to cart, use either:
- plain numeric string `"42"`, or  
- `"${groupId}:${optionId}"`  

Prefer `groupId:optionId` for uniqueness in line keys.

### Cart storage bump

When id semantics change, **bump** cart persistence so old hashed carts do not poison checkout:

- `src/store/cart.ts`: `STORAGE_KEY` and/or `version` field  
- e.g. `el-quetzalito-cart` → `el-quetzalito-cart-v2`

---

## 3. Implementation phases (do in order)

### P0 — Contract (docs + guards) — ~30 min

**Deliverables**
- This file is the plan (already). Optionally add a one-liner in `CONTEXT.md` if catalog/cart language needs it.
- Add a short comment on `CartItemSnapshot.id`: “Payload menu-item id only.”
- Do **not** invent more `stableId` usages.

**DoD:** Future code review rejects hash-based cart ids.

---

### P1 — Seed parity (CMS has marketing menu) — medium

**Goal:** Every orderable static menu item exists in Payload with matching **slug** and correct **cents** price.

**Source of truth for v1:** derive seed input from  
`features/restaurant/menu/data/{breakfast,appetizers,especiales,bakery,drinks,dailySpecials}.ts`

**Deliverables**
1. Map static categories → Payload category slugs (create/upsert categories):

   | Static id | Suggested CMS slug | Notes |
   |-----------|-------------------|--------|
   | `breakfast` | `breakfast` | |
   | appetizers | `appetizers` | |
   | `especiales` | `especiales` | |
   | `bakery` | `bakery` | |
   | `drinks` | `drinks` | |
   | daily specials | `daily-specials` | steamTable for many items |

2. Rewrite or extend `src/payload/seed.ts` menu item list:
   - Upsert by **slug** (pattern already used for categories/groups)
   - `basePrice: Math.round(price * 100)` from static dollars
   - Skip `priceLabel`-only items **or** seed without `active` / omit from orderable list until fixed
   - `availabilityType`: daily-specials / steam-table dishes → `steamTable`; else `madeToOrder`
   - Keep existing modifier groups (`sides`, `spice-level`, `size`, `bebida-size`); attach where product-sensible (not required for first vertical)

3. Run seed against local DB; verify in Payload admin: item count, sample slugs (`carne-asada`, `churrasco-tikal`, …).

**DoD**
- `payload.find({ collection: 'menu-item', where: { slug: { equals: 'carne-asada' } } })` returns a doc with expected cents price.
- Seed is idempotent (re-run updates, no dupes).

**Out of scope for P1:** images in Media for every item (optional; static `/Menu/*.avif` can still power marketing UI).

---

### P2 — Catalog loader (server) — small/medium

**Goal:** One module the menu page and (later) checkout context can share.

**New file (suggested):** `lib/catalog.ts` or `src/lib/catalog.ts`  
(Prefer `src/lib/` if checkout libs live under `src/lib/checkout/`; keep consistent.)

**API sketch**

```ts
export type OrderableCatalog = {
  categories: Category[];
  items: MenuItem[]; // depth enough for modifierGroups + options
  itemsBySlug: Map<string, MenuItem>;
  itemsById: Map<number, MenuItem>;
  soldOutIds: Set<number>; // steam-table sold out today
  isOpen: boolean;
  timeZone: string;
};

export async function getOrderableCatalog(): Promise<OrderableCatalog>;
export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null>;
```

**Implementation notes**
- Use Payload Local API (`getPayload({ config })`), not REST.
- Fetch active items (`active: true`), depth `2` for modifier groups/options.
- Today’s date via `formatToday(storeSettings.timezone)` from `lib/menu-helpers.ts`.
- Sold-out: `DailyAvailability` for today + `buildSoldOutSet`.
- Cache carefully: for owner-editable prices, prefer short revalidate or no cache on checkout path; menu page may use `unstable_cache` / `revalidate` later.

**DoD:** Unit or integration smoke: loader returns ≥ N items after seed; sold-out set works when a daily row exists.

---

### P3 — Wire menu → cart with real IDs — medium

**Goal:** Adding an item stores Payload `id` in the cart.

**Remove / replace**
- `to-orderable-item.ts` hash path for cart.  
  Either delete or rewrite to `toCartSnapshot(item: MenuItem): CartItemSnapshot` using **real** fields only.

**Menu UI paths**

Preferred (CMS-first on `/menu`):
1. `app/(marketing)/menu/page.tsx` (or a server child) calls `getOrderableCatalog()`.
2. Pass CMS items into `MenuOrder` / sections / cards.
3. `MenuItemConfigurator` already expects Payload `MenuItem` — feed real docs.
4. `MenuItemCard`: show photo from static `/Menu/` by slug if CMS media empty (optional UX).

Acceptable bridge (slug join):
1. Keep static layout/labels.
2. On “Add to cart”, resolve `itemsBySlug.get(static.slug)`; if missing, disable add.
3. Still must not invent ids.

**Cart**
- Bump storage key / version.
- Ensure `buildItemSnapshot` in configurator uses `item.id`, `item.basePrice` (cents), `getCategoryId(item.category)`, `item.availabilityType`.

**Marketing import boundary**
- Pages under `app/(marketing)/**` may only import `@/features/marketing/**`.
- Put server data fetch in a marketing barrel or pass data from a server component that only imports marketing wrappers which import restaurant components.

**DoD**
- DevTools: after add, cart line `itemSnapshot.id` equals Payload admin id for that slug.
- Refresh keeps cart; old hashed carts cleared by version bump.
- Items without CMS row cannot add.

**Vertical tracer (recommended before full menu):**
1. Seed + load only **especiales**.
2. Wire only that section to CMS ids.
3. Prove quote (P4) with 1–2 items before converting entire menu.

---

### P4 — Checkout Layer A (quote logic) — small

**Goal:** Port pure domain logic from `feat/checkout`.

```bash
git cherry-pick 3a0d893
# commit: feat(checkout): add quote, promotion, tax/tip, and slot generation logic
```

**Files:** all under `src/lib/checkout/` (+ tests).

**Verify**
```bash
pnpm exec tsx --test src/lib/checkout/*.test.ts
pnpm lint:fix
pnpm exec tsc --noEmit
```

**DoD:** All checkout unit tests pass on `feat/ordering`. No UI required yet.

Optional: temporary server-only debug action or script that calls `computeQuote` with a real cart line (real id) to prove recompute against seeded DB.

---

### P5 — Checkout UI + `getQuote` — medium

**Goal:** Guest can open `/checkout`, see server quote, not necessarily pay yet.

**Cherry-pick**
```bash
git cherry-pick 44a1388
```

**Then patch**

1. **Input:** restore `components/ui/input` via shadcn (`pnpm cn input` / project script) **or** replace with accessible native `<input>` + Label (faster, fewer deps).
2. **Icons:** re-export needed icons in `components/icons.tsx` only:
   - `UserIcon`, `PhoneIcon`, `EnvelopeIcon`, `CalendarIcon`, `ClockIcon`, `SparklesIcon`, `HeartIcon`
3. **Imports:** `formatPrice` → `@/lib/menu-helpers`
4. **`submitCheckout` / Stripe:**
   - **Option A (recommended for P5):** land UI + `getQuote`; stub `submitCheckout` to return a clear error *or* create order without Stripe (order-first partial) until P6.
   - **Option B:** also cherry-pick/copy `src/lib/stripe.ts` from `feat/payments` + env.
5. Ensure `app/(storefront)/layout.tsx` wraps `/checkout` (already exists).
6. Cart “Proceed to checkout” already targets `/checkout`.

**DoD**
- `/menu` → add item (real id) → cart → `/checkout`
- Quote panel shows subtotal/tax/tip/total from `getQuote` with `validationErrors: []`
- Invalid/sold-out item surfaces server error copy

**Lint:** `payload-types.ts` is ignored by oxlint; do not fight generated `eslint-disable`.

---

### P6 — `submitCheckout` + Stripe (payments bridge) — medium

**Goal:** Order-first + Checkout Session.

**From `feat/payments` (not full branch):**
- `src/lib/stripe.ts` (`createCheckoutSession`)
- Later: webhook + success/cancel pages (can stay on payments phase)

**Env (see `plans/01-architecture.md` / `.env.example`):**
- `STRIPE_SECRET_KEY` (test)
- `NEXT_PUBLIC_SERVER_URL`
- DB + Payload already required for quote

**DoD**
- Submit creates `orders` (`pending_payment`) + line snapshots + `payment_intents`
- Returns Stripe `checkoutUrl`; redirect works in test mode
- Webhook flip to `paid` can be a follow-up if not in this PR

---

## 4. Explicit non-goals (this plan)

- Full payments stack (webhooks polish, refunds) — `feat/payments`
- Owner dashboard — `feat/owner`
- Delivery / accounts / BOGO — out of product scope per `plans/README.md`
- Rewriting home/marketing static content into CMS (optional later)
- Fixing every `priceLabel` variable-price item in v1

---

## 5. Suggested file touch list

| Phase | Paths |
|-------|--------|
| P1 | `src/payload/seed.ts`, possibly `scripts/build-menu-seed.ts` |
| P2 | `src/lib/catalog.ts` (or `lib/catalog.ts`) |
| P3 | `features/restaurant/menu/*`, `app/(marketing)/menu/page.tsx`, `features/marketing/menu/*`, `src/store/cart.ts`, delete/rewrite `to-orderable-item.ts` |
| P4 | `src/lib/checkout/**` via cherry-pick `3a0d893` |
| P5 | cherry-pick `44a1388` + `components/ui/input.tsx`, `components/icons.tsx`, `app/actions/checkout.ts` patches |
| P6 | `src/lib/stripe.ts` from `feat/payments`, env |

---

## 6. Verification checklist (end of each phase)

```bash
pnpm lint:fix
pnpm exec tsc --noEmit
# unit tests as relevant:
pnpm exec tsx --test src/store/cart.test.ts
pnpm exec tsx --test components/modifier-selector-logic.test.ts
pnpm exec tsx --test src/lib/checkout/*.test.ts   # after P4
```

Manual after P5:
1. Seed DB  
2. Open `/menu`, add **Carne Asada** (or seeded slug)  
3. Confirm cart JSON id matches admin  
4. Open `/checkout`, apply tip/promo if seeded  
5. Quote totals match cents math  

---

## 7. Risk register

| Risk | Mitigation |
|------|------------|
| Seed drift vs static menu | Generate seed from static data; single script |
| Hash carts in localStorage | Storage key version bump |
| Marketing import oxlint boundary | Only import `@/features/marketing/**` from `app/(marketing)` |
| Components cannot import `app/**` | Use `@/lib/*` or `@/src/*` only |
| Price drift UX (hard fail) | P5: clear errors; later soft-correct quote |
| Stripe missing | Stub submit in P5; real in P6 |
| Daily specials steam-table | Seed `steamTable` + DailyAvailability for sold-out tests |

---

## 8. Branch / PR strategy

1. Stay on `feat/ordering` **or** branch `feat/cms-cart-bridge` from `b1418e2`.  
2. Prefer small commits matching phases: `seed(catalog)`, `feat(catalog): loader`, `feat(menu): cms cart ids`, `feat(checkout): quote logic`, `feat(checkout): ui + getQuote`, `feat(payments): stripe session`.  
3. Do not merge `feat/checkout` wholesale — cherry-pick the two commits after P3.  
4. Ignore/archive parallel `feat/full-func` duplicate SHAs unless needed for reference.

---

## 9. Definition of done (whole plan)

- [ ] Cart only stores Payload menu-item ids  
- [ ] Seed covers orderable marketing menu (slug parity)  
- [ ] `/menu` add-to-cart → real ids  
- [ ] `3a0d893` on branch; checkout unit tests pass  
- [ ] `/checkout` shows successful `getQuote` for a real cart  
- [ ] (Stretch) `submitCheckout` creates order + Stripe test session  
- [ ] `pnpm lint:fix` + `tsc` clean  

---

## 10. Quick start for the implementing agent

```text
1. Read this file + ADR 0001/0002 + plans/03 Flow A–C.
2. Implement P1 seed parity (especiales first if time-boxed).
3. P2 catalog loader.
4. P3 wire especiales only → prove cart id.
5. Cherry-pick 3a0d893 (P4); run checkout tests.
6. Temporary getQuote call with real cart line; confirm no validation errors.
7. Only then P5 UI cherry-pick + Input/icons fixes.
8. P6 Stripe when quote is green.
```

**First command after checkout of branch:**  
`git log -1 --oneline` should be at or after `b1418e2` on `feat/ordering` lineage.
