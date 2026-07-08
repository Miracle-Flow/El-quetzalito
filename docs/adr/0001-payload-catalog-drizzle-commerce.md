# ADR-0001: Payload CMS for catalog & merchandising; Drizzle for transactional commerce

- **Status:** Accepted
- **Date:** 2026-07-08

## Context

El Quetzalito (a Guatemalan/Central American restaurant with a daily steam table)
needs (1) an **owner-managed menu/catalog** with daily steam-table availability
and the ability to run promotions/sales at any time, and (2) **online ordering
with payments** for pickup.

The stack is Next.js 16 + React 19 + TypeScript, and the team already uses
Drizzle-flavored Postgres conventions. The open question was both *which* CMS to
use and *where the transactional commerce truth lives* relative to that CMS.

## Decision

- **Payload CMS 3.x** (Postgres adapter, self-hosted **inside** the Next.js app
  via its Local API) owns the **catalog & merchandising** domain: `Menu`,
  `Category`, `MenuItem`, `ModifierGroup`, `ModifierOption`, `Promotion`,
  `DiscountCode`, `SaleCampaign`, `StoreSettings`, and `Media`.
- **Drizzle ORM** on the **same Postgres database** owns the **transactional
  commerce truth**: `Order`, `OrderLineItem`, `Customer`, `PaymentIntent`,
  `WebhookEvent`, `PickupSlot`, and `Cart` (if persisted).
- Checkout reads catalog/promotions via Payload's **Local API** (in-process, so
  authoritative — no caching/sync staleness) and writes orders/payments via
  Drizzle.

## Consequences

**Positive**
- Single Postgres DB. Payload Local API means in-process reads — no separate
  content service to deploy and no content-vs-commerce sync problem.
- Owner gets Payload's built-in admin UI for editing the menu, toggling daily
  steam-table availability, and creating discount codes — we don't build that.
- Payment webhooks and order-state transitions write to clean, migration-
  controlled, constraint-backed Drizzle tables; an order and its payment can be
  updated in one DB transaction.
- Clear ownership boundary: **CMS = authoring / read-mostly; Drizzle =
  transactional.**

**Negative**
- The owner views **orders** through a small custom dashboard we build, not the
  Payload admin. Accepted: the order UI is a simple list + state actions, cheap
  to build, and keeps order/payment logic clean.
- Two query layers exist in the app (Payload Local API + Drizzle). Developers
  must know which side a given entity lives on.
- Cross-boundary references (`OrderLineItem` → `MenuItem` id) are **soft** foreign
  keys with no DB-level constraint. Mitigation: validate at write time and treat
  catalog items as archive-don't-delete.

## Alternatives considered

- **Everything in Payload** (orders/customers/payments as Payload collections,
  unified admin). Rejected: payment webhook idempotency and order/payment atomic
  transitions want direct SQL control; Payload's collection/validation/hook layer
  over webhook handlers adds risk on the most fragile code path (e.g., a
  redelivered webhook firing `afterChange` hooks twice).
- **Sanity** (hosted content lake + Studio). Rejected: best-in-class editing UX
  and CDN, but a separate source of truth from the orders DB. Better suited to
  marketing/editorial content than to commerce data that must be co-located with
  orders.
- **Keystatic** (git-based CMS). Rejected: content lives in the repo, so a
  non-technical owner cannot change a price or run a flash sale without a
  commit/review cycle.
- **No CMS / custom admin** (everything in Drizzle, build the owner editor from
  scratch). Rejected: rebuilds exactly what a CMS gives for free.
