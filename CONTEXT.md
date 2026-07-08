# El Quetzalito — Domain Context

This is the **ubiquitous language** for the El Quetzalito domain. Terms are
resolved during design conversations and recorded here so everyone (humans and
agents) shares one precise vocabulary. Implementation details do not belong here
— only language meaningful to the business.

When a term is resolved, update this file inline. When two terms conflict, raise
it immediately. Propose precise canonical terms for fuzzy language.

---

## Glossary

### El Quetzalito
The business: a Guatemalan / Central American **restaurant**. The product is
prepared food, not physical goods or software. This shapes every downstream
decision (inventory is daily, fulfillment is time-bound, freshness matters).

### Steam Table
The restaurant's core service model: hot, pre-cooked dishes are held in a
steam table and served all day, seven days a week. Implication for the menu
model: **daily availability rotates** — a dish may be on the menu but not
available *today*, and can sell out during the day. Contrast with made-to-order
items, which are conceptually always available until the kitchen stops service.

### Menu
The restaurant's catalog of dishes and drinks. In commerce terms this is the
**product listing**. (Catalog modeling — categories, modifiers, sizes — is a
pending decision.)

### Pickup
An **order fulfillment channel**: the customer places and pays for an order
online, then travels to the restaurant to collect it at a chosen ready-time.
This is the confirmed **MVP** fulfillment channel. Other channels considered
and deferred: Delivery, Dine-in / QR table ordering, Catering.

### Menu Item
A single orderable dish or drink on the Menu. Has a base price, and may have
**Modifiers** (choices the customer makes, e.g. size, spice level, sides). Each
menu item has an **availabilityType** (see Steam-Table Item vs Made-to-Order
Item). Distinguished from an Order Line Item, which is a *snapshot* of a menu
item (with chosen modifiers and a locked price) placed into a specific order.

### Modifier Group / Modifier Option
A **Modifier Group** is a set of choices attached to a Menu Item — e.g.
"Choose your two sides." A group is *pick-one* or *pick-many*, *required* or
*optional*, and its options may be *included* (no upcharge) or *priced* (a
delta added to the item's base price). A **Modifier Option** is one choice in a
group (e.g. "Rice and beans", "Extra spicy", "Large"). Combos ("choose 2
sides") are a pick-many included group.

### Steam-Table Item
A Menu Item whose `availabilityType` is `steamTable`: pre-cooked and held hot
in the steam table. It is **only orderable when it is "on today" and not Sold
Out**. Contrast with Made-to-Order Item.

### Made-to-Order Item
A Menu Item whose `availabilityType` is `madeToOrder`: prepared on demand
(e.g. drinks, some antojitos). Always orderable during service hours — it does
not rotate daily and does not "sell out" in the steam-table sense.

### Daily Availability
A per-day, per-steam-table-item record of whether the item is being served
today and its live stock status. The day's table defaults to **all active
steam-table items ON**; the owner toggles items off or marks them Sold Out as
the day progresses. Statuses for MVP: **available**, **soldOut**. Kept for
history ("did we sell out last Tuesday?").

### Sold Out
A terminal, day-scoped status for a steam-table item: it was on today but has
run dry, so it can no longer be ordered for the rest of the day. Distinct from
being off the menu entirely (a persistent, owner-authored change).

### Order
A single customer's request: a set of Order Line Items for Pickup, to be paid
for and collected at a chosen ready-time. Lives in Drizzle (transactional
truth). Created **before** payment (order-first) and progresses through Order
States. Linked to one Customer and one payment.

### Order Line Item
A snapshot of one Menu Item (with its chosen Modifiers and a **locked price
recomputed by the server**) placed into a specific Order. The price is frozen
at order time so historical orders never change when the menu price later
changes. Carries a soft reference to the originating Menu Item.

### Order State
The lifecycle of an Order. MVP states and transitions:
- **pending_payment** — Order created, awaiting Stripe payment.
- **paid** — payment succeeded (set by the Stripe webhook); order accepted and
  queued for the kitchen.
- **ready** — owner action; plated and waiting at the counter for pickup.
- **completed** — owner action; customer has collected the order.
- **canceled** — order voided. Canceling a *paid* order always triggers a
  Stripe refund (recorded via the `charge.refunded` webhook); canceling a
  *pending_payment* order just expires it.

No `preparing`/`in_progress` state for MVP (steam-table prep is near-instant).
Transitions are guarded (no backward moves from terminal states).

### Customer
The person placing an order, identified by contact info (name + phone + email).
For MVP there are **no accounts / no login** (guest-only). A Customer record
(keyed by phone/email, in Drizzle) lets repeat guests be recognized and lets the
owner see who ordered — without any auth system.

### Promotion
An owner-authored discount, modeled in Payload. Two kinds: a **Sale Campaign**
(automatically applied when its rules match — e.g. "10% off all platos fuertes,
Sat–Sun") and a **Discount Code** (a code the customer enters at checkout — e.g.
"FAMILY15, $15 off orders over $80"). Each promotion is percent or fixed amount,
scoped to the whole order or a single category, time-windowed
(validFrom/validUntil), and may have a minimum-order value. **No stacking**: at
most one promotion applies per order. Free-item / BOGO promotions are deferred.

### Order Total
What the customer is charged, composed as:
**subtotal** (sum of line items, server-recomputed) **− promotion discount** **+
tax** **+ tip**.
- Tax is a single owner-configured rate on prepared food, applied to the
  *discounted* subtotal (not on the tip).
- Tip is optional (presets + custom + none), computed on the *pre-tax* subtotal.
The server computes the full total; Stripe Checkout charges exactly that amount.
