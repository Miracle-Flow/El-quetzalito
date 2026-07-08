# 03 — Request Flows

All server-side reads of catalog/promos go through **Payload Local API**
(`getPayload({ config })`) — in-process, authoritative. All commerce writes go
through **Drizzle**. Money is cents.

## A. Browse the menu (Server Components)
1. `getPayload` → fetch active `Category`s (sorted) → for each, active `MenuItem`s (sorted).
2. For steam-table items, fetch today's `DailyAvailability` (status by item). Compute orderability:
   `orderable = item.active && (availabilityType === 'madeToOrder' || dailyStatus !== 'soldOut')`.
3. Render with `soldOut` badges; disable add-to-cart on sold-out items.
4. Header shows store open/closed (from `StoreSettings.weeklyHours` + `dailyOverrides` + `timezone`, evaluated "now").

## B. Add to cart (client, Zustand)
- Cart state: `{ items: [{ menuItemId, name, basePriceDisplay, quantity, selectedOptions, image? }], pickupMode, pickupSlot, promoCode, tip }`.
- Persist to `localStorage` (survives refresh; not cross-device — fine for food).
- **Client prices are display-only.** All totals shown are provisional; the
  server recomputes authoritatively at checkout.

## C. Checkout — create order + Stripe Session (Server Action `src/actions/checkout.ts`)
**Input (Zod-validated):** cart items (with chosen option ids), `pickupMode`
(`asap`|`scheduled`), `pickupSlot` (if scheduled), customer (`name`,`phone`,`email`),
optional `promoCode`, `tipCents`.

1. **Recompute prices (trust boundary).** For each cart line: read `MenuItem` +
   its `ModifierGroup`s/`ModifierOption`s from Payload; resolve the chosen option
   ids; verify they belong to the item and satisfy group constraints
   (required/min/max); compute `unit_price + Σ priceDelta`. Reject any unknown id
   or constraint violation.
2. **Re-validate availability.** Re-check each item is still `active` and
   (steam-table) not `soldOut` *now*. Reject if anything went sold-out mid-flow.
3. **Subtotal** = Σ `line_total`.
4. **Promotion.** Resolve exactly one promotion:
   - If `promoCode`: look up active `Promotion` by code; validate `applicationType=code`,
     within window, `minOrderValue`, scope.
   - Else: find an active `auto` promotion in-window whose scope matches; pick the
     best (single — **no stacking**).
   - Compute `discount_total` (percent on scoped lines, or fixed). Zero if none.
5. **Tax** = `taxRate × max(0, subtotal − discount_total)` (integer cents).
6. **Tip** = client-supplied (`tipCents`); validate it's one of the presets (×
   pre-tax subtotal, rounded) or a non-negative custom. Default 0.
7. **Total** = `subtotal − discount_total + tax + tip`.
8. **Validate pickup.** Confirm `pickupMode`/`pickupSlot` is legal: store open,
   slot ≥ now+leadTime, within today's hours, on the 15-min grid (see Flow H).
9. **Upsert Customer** by `phone` (backfill `email`/`name`).
10. **Create the order (one transaction):** insert `orders` (`pending_payment`,
    totals, pickup, snapshots), `order_line_items`, `payment_intents` (`pending`,
    `amount=total`). Generate `order_number`.
11. **Create Stripe Checkout Session:** `mode='payment'`, `amount` via a single
    line item (or itemized lines + tax + tip + discount as adjustments — pick
    whatever Stripe supports cleanly in the pinned version), `metadata.orderId`,
    `customer_email`, `success_url`/`cancel_url` (`${BASE_URL}/checkout/success`
    / `/cancel`), `payment_intent_data.metadata.orderId`.
12. Return `{ sessionUrl }` → client redirects. (The success URL is a *redirect
    landing*, not confirmation — confirmation comes from the webhook.)

## D. Stripe webhook (`app/api/stripe/webhook/route.ts`)
Handles `checkout.session.completed` and `charge.refunded` (minimally).

1. **Verify signature** with `STRIPE_WEBHOOK_SECRET` (raw body — Route Handler,
   read the request stream; do not parse JSON first).
2. **Idempotency:** `insert` into `webhook_events` with `stripe_event_id` unique —
   if it collides, the event was already processed; ack `200` and stop.
3. Switch on `type`:
   - `checkout.session.completed`: read `metadata.orderId`; transition that order
     `pending_payment → paid`; set `payment_intents.stripe_payment_intent_id` /
     `stripe_charge_id`, `status='succeeded'`. (Stripe sends the receipt — we send
     nothing here.)
   - `charge.refunded`: transition the related order → `canceled`;
     `payment_intents.status='refunded'`.
4. Mark `webhook_events.processed_at`.
5. Wrap transitions in a transaction; respond `200` fast; surface errors via `500`
   so Stripe retries (idempotency protects redelivery).

## E. Owner lifecycle actions (custom `(owner)/orders` dashboard, Payload-auth-gated)
- **Mark ready:** `paid → ready`, then **send "ready for pickup" email** (Resend).
- **Mark completed:** `ready → completed`.
- **Cancel (paid):** create a Stripe Refund for the charge; the `charge.refunded`
  webhook completes the transition to `canceled`. (Don't flip status locally
  before the refund webhook — let the webhook own it.)
- **Cancel (pending_payment):** transition to `canceled` directly (nothing to refund).

## F. Notifications (Resend + react-email)
- **Payment receipt:** Stripe sends it (customer email passed to Checkout).
- **"Ready for pickup":** we send on `paid → ready` (Flow E). Template includes
  `order_number`, pickup instructions, address.
- Optional branded order-confirmation (on `paid`) — only if we want our own beyond
  Stripe's. Keep optional for MVP.

## G. Availability gating (canonical predicate)
```
orderable(item, today):
  item.active
  AND (
    item.availabilityType === 'madeToOrder'
    OR (item.availabilityType === 'steamTable'
        AND dailyStatus(today, item.id) !== 'soldOut')
  )
  AND storeIsOpenFor(pickupAt)
```

## H. Pickup slot generation (server, `src/lib/checkout/slot-generation.ts`)
1. Load `StoreSettings`: weekly hours for today + any `dailyOverrides` for today;
   resolve open/close in the restaurant TZ. If closed today → no slots.
2. `earliest = max(open, now + leadTimeMinutes)`.
3. Generate 15-min slots from `ceil(earliest)` to `close − bufferMinutes`
   (buffer ≈ leadTime so an order can actually be fulfilled).
4. **TODAY-ONLY** (no future days) — see ADRs. Slots are generated on demand,
   not stored (no per-slot capacity in MVP).
5. ASAP mode: `pickup_at = now + leadTimeMinutes` (no slot chosen).

## Edge cases the flows must handle
- Item sells out between cart and checkout → checkout rejects with a clear message.
- Store closes between cart and checkout → reject / offer next open day (today-only ⇒ reject).
- Stripe session expires (~30 min) with no payment → a cleanup job (or lazy check)
  transitions stale `pending_payment` orders to `canceled`.
- Webhook arrives before the success redirect lands → the success page must read
  order status from the DB (poll or revalidate), not assume.
- Refund webhook redelivered → idempotent (unique `stripe_event_id`).
