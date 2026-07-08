# ADR-0002: Stripe (Checkout) for payments, order-first lifecycle, guest-only checkout

- **Status:** Accepted
- **Date:** 2026-07-08

## Context

El Quetzalito needs online payment for pickup orders. This ADR locks four
tightly-coupled, hard-to-reverse decisions: the **payment provider**, the
**payment surface**, the **order-vs-payment lifecycle**, and the **checkout
identity model**. These are recorded together because each constrains the others
and changing any one later is painful.

## Decisions

1. **Provider: Stripe** (not Square, not Paddle).
2. **Surface: Stripe Checkout (hosted redirect)** — the server builds a Checkout
   Session from the validated cart and redirects the customer to Stripe's hosted
   payment page (card / Apple Pay / Google Pay / Link), then back to the site.
3. **Lifecycle: order-first.** The `Order` + `OrderLineItem`s are created in
   Drizzle with status `pending_payment` *before* the Checkout Session; the
   payment webhook (`checkout.session.completed`) transitions the order to
   `paid`.
4. **Identity: guest-only.** No accounts or login. Each order captures name +
   phone + email; a `Customer` record keyed by phone/email recognizes repeat
   guests.

## Consequences

**Positive**
- Stripe Checkout keeps the app out of PCI scope (no card data touched) and gives
  Apple Pay / Google Pay / Link out of the box — critical for mobile, where most
  food orders originate. Minimal payment-form code.
- Stripe auto-emails the payment receipt (customer email passed to Checkout), so
  only the "ready for pickup" notice needs to be sent by us (ADR-implicit; via
  Resend).
- Order-first guarantees an order row always exists in our DB. A dropped webhook
  degrades to a `pending_payment` order to reconcile, never to a charge with no
  order (the worst support case). Order + payment can be reasoned about with a
  single source of truth in Drizzle.
- Guest-only removes the entire auth subsystem (Better Auth, sessions, password
  flows) from the MVP, eliminating checkout friction at the worst moment.

**Negative**
- Hosted-redirect means a visual hand-off to Stripe and back. Accepted: standard
  for pickup ordering; the surrounding cart/contact/scheduling UX stays on-site.
  Migrating to Embedded Checkout or custom Elements later is largely reversible
  because the order/cart model is independent of the payment surface.
- Order-first produces `pending_payment` rows for abandoned carts; a cleanup job
  / Session-expiry handler is required.
- Guest-only means no order history, saved details, reordering, or loyalty until
  accounts are added in a later phase.
- Webhook handling still requires idempotency (idempotency key + append-only
  `WebhookEvent` log) to survive Stripe's at-least-once redelivery.

## Alternatives considered

- **Square** (Payments + Orders API with native PICKUP fulfillment). Strongest
  fit *if* the restaurant already runs Square in-store — it would unify POS,
  catalog, payouts, and online ordering. Rejected because the project is being
  built as a custom Next.js storefront (signaling a desire for control) and no
  existing Square POS was confirmed; unified-operations value didn't apply.
- **Paddle** (Merchant of Record). Rejected outright: Paddle is built for
  SaaS/digital software, not physical prepared food.
- **Embedded Checkout / custom Elements.** More control over the payment surface
  but more code for little MVP benefit; deferred as a reversible later option.
- **Payment-first lifecycle** (create the Order only on the webhook). Rejected: a
  dropped webhook would leave a charge with no order, requiring session-polling
  reconciliation.
- **Account-required checkout.** Rejected: creates severe drop-off at the moment
  of purchase; unjustified for a restaurant MVP.
