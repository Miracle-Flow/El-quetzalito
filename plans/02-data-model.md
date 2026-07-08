# 02 — Data Model

**Money is integer cents everywhere.** Drizzle tables live in the `commerce`
Postgres schema (see `01-architecture.md`). Payload collections use its default
table management. All `{timestamp}` fields use Payload defaults; Drizzle uses
`createdAt`/`updatedAt` (`timestamptz`, default now / on update now).

## Payload collections (catalog + promotions) — owned, edited via Payload admin

### `Menu`
Optional top-level grouping (MVP = a single record). Fields: `name` (text),
`slug`, `active` (checkbox). Lets future menus (lunch / catering) be added.

### `Category`
- `name` (text) — e.g. "Platos Fuertes", "Sopas", "Bebidas"
- `slug` (auto from name)
- `description` (textarea, optional)
- `menu` (relationship → Menu, optional)
- `sortOrder` (number)
- `active` (checkbox)

### `MenuItem`
- `name` (text) — **single field, bilingual-by-mixing** (Spanish name is fine, e.g. "Pepián")
- `slug`
- `description` (textarea) — typically English
- `basePrice` (**number, cents**)
- `category` (relationship → Category)
- `availabilityType` (select: `steamTable` | `madeToOrder`)
- `active` (checkbox — persistent on-menu flag; off = not orderable ever)
- `image` (upload → Media, optional)
- `modifierGroups` (relationship array → ModifierGroup)
- `sortOrder` (number)

### `ModifierGroup`
- `label` (text) — e.g. "Choose your two sides", "Spice level"
- `selectionType` (select: `pickOne` | `pickMany`)
- `required` (checkbox)
- `minSelection` / `maxSelection` (number — for pickMany combos like "choose 2")
- `pricingMode` (select: `included` | `priced`)
- `options` (relationship array → ModifierOption)

### `ModifierOption`
- `label` (text) — e.g. "Rice and beans", "Extra spicy", "Large"
- `priceDelta` (**number, cents**; `0` for `included` groups)
- `group` (relationship → ModifierGroup)

### `DailyAvailability` (per-day steam-table status; unique on `date` + `menuItem`)
- `date` (date, stored as calendar day in restaurant TZ)
- `menuItem` (relationship → MenuItem — steam-table items only)
- `status` (select: `available` | `soldOut`)
- Semantics: **a steam-table item is orderable today unless a `soldOut` record
  exists for (today, item).** Absence of a record ⇒ available ("today's table
  defaults all-on"). The owner toggles `soldOut` as batches run dry. History is
  retained ("did we sell out last Tuesday?").

### `Promotion` (unifies Sale Campaign + Discount Code)
- `name` (text, internal)
- `applicationType` (select: `auto` | `code`)
- `code` (text — **required iff `applicationType=code`**, unique)
- `discountType` (select: `percent` | `fixed`)
- `value` (number — percent 0–100, **or** fixed in cents)
- `scope` (select: `order` | `category`)
- `category` (relationship → Category — required iff `scope=category`)
- `validFrom` / `validUntil` (date)
- `minOrderValue` (number, cents, optional)
- `active` (checkbox)

### `StoreSettings` (Payload **global** / singleton)
- `weeklyHours` (group array, one per weekday: `day`, `open`, `close` | `closed`)
- `dailyOverrides` (group array: `date`, `closed` | special `open`/`close`) — holidays, emergencies
- `timezone` (text — IANA, e.g. `America/New_York`) — drives "today", slot windows, rendering
- `taxRate` (number — decimal fraction, e.g. `0.08875`)
- `leadTimeMinutes` (number) — pickup lead time
- `slotIntervalMinutes` (number, default `15`)
- `tipPresets` (number array — percentages, e.g. `[15,18,20]`)
- `address`, `phone`, `pickupInstructions` (text) — for emails + success page

### `Media`
Default Payload upload collection (menu item images).

---

## Drizzle tables (transactional truth) — `commerce` schema

### `commerce.customers`
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `phone` | text, **unique** | primary repeat-guest key |
| `email` | text, nullable | for receipts |
| `name` | text | |
| `created_at` / `updated_at` | timestamptz | |

Upsert on `phone`; backfill `email`/`name` from the latest order.

### `commerce.orders`
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `order_number` | text, unique | human-friendly, e.g. `EQ-1042` (sequence) or `EQ-YYYYMMDD-NN` |
| `customer_id` | uuid fk → customers | |
| `status` | enum(`pending_payment`,`paid`,`ready`,`completed`,`canceled`) | |
| `subtotal` | int (cents) | server-recomputed |
| `discount_total` | int (cents) | |
| `promotion_id` | text, nullable | **soft ref** to Payload Promotion id |
| `promotion_code` | text, nullable | snapshot |
| `tax_total` | int (cents) | `taxRate × (subtotal − discount_total)` |
| `tip_total` | int (cents) | client-chosen, on pre-tax subtotal |
| `total` | int (cents) | `subtotal − discount + tax + tip` (the charged amount) |
| `pickup_mode` | enum(`asap`,`scheduled`) | |
| `pickup_at` | timestamptz | now+lead (asap) or chosen slot |
| `notes` | text, nullable | customer notes |
| `customer_name` / `customer_phone` / `customer_email` | text | snapshot at order time |
| `stripe_checkout_session_id` | text, nullable | |
| `stripe_payment_intent_id` | text, nullable | |
| `created_at` / `updated_at` | timestamptz | |

### `commerce.order_line_items`
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `order_id` | uuid fk → orders (cascade) | |
| `menu_item_id` | text | **soft ref** to Payload MenuItem id |
| `menu_item_name` | text | snapshot |
| `unit_price` | int (cents) | server-recomputed base price at order time (frozen) |
| `quantity` | int | |
| `selected_options` | jsonb | `[{ groupId, groupLabel, optionId, optionLabel, priceDelta }]` |
| `line_total` | int (cents) | `(unit_price + Σ priceDelta) × quantity` |
| `sort_order` | int | |

### `commerce.payment_intents` (1:1 with order)
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `order_id` | uuid fk → orders (unique) | |
| `stripe_payment_intent_id` | text, nullable | |
| `stripe_charge_id` | text, nullable | |
| `amount` | int (cents) | |
| `status` | enum(`pending`,`succeeded`,`refunded`,`partially_refunded`) | |
| `created_at` / `updated_at` | timestamptz | |

### `commerce.webhook_events` (append-only idempotency log)
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `stripe_event_id` | text, **unique** | the idempotency key |
| `type` | text | e.g. `checkout.session.completed` |
| `received_at` | timestamptz default now | |
| `processed_at` | timestamptz, nullable | |
| `payload` | jsonb | raw event body |

## Invariants the schema enforces / the app must uphold
- Order total is **always** recomputed server-side from the catalog; the stored
  `total` must equal what Stripe was asked to charge.
- Order line prices are **frozen snapshots** — later menu price edits never
  mutate historical orders.
- `webhook_events.stripe_event_id` uniqueness makes webhook handling idempotent
  across Stripe's at-least-once redelivery.
- State transitions are guarded in app code (no backward moves from
  `completed`/`canceled`).
