# 06 — Clover Receipt Printing (Stripe → Clover)

**Goal:** After a successful **Stripe Checkout** payment, automatically print a
receipt on the merchant's **Clover** device. Stripe owns payment; Clover owns
only receipt printing.

This plan extends the existing order-first Stripe flow in `02-data-model.md` /
`03-request-flows.md`. **Money is cents; receipts are rendered server-side.**

> **Read the validation answers in §0 first.** They contain a partial blocker
> that reshapes the architecture: Clover **cannot** print its *standard* payment
> receipt for a Stripe charge. We must print a **custom text receipt**.

---

## 0. Validation answers (cite-checked against official docs)

These are the questions the task said must be answered **before** implementing.
Every answer cites Clover or Stripe's official docs.

### Q1. Can Clover print a receipt for a payment processed entirely by Stripe?
**Not a *standard* Clover payment receipt.** The standard payment-receipt
endpoint embeds a **Clover** transaction id in the URL:

> `POST /connect/v1/payments/{paymentId}/receipt` — `paymentId` … **Clover payment UUID**,
> required, length between 13 and 13.
> — [Deliver a payment receipt](https://docs.clover.com/dev/reference/deliver_payment_receipt)

A Stripe charge yields a `pi_…` / `ch_…` id and produces **no** Clover payment
object, so that path is unusable for a Stripe payment.

### Q2. Does Clover require a native Clover Payment object to print a standard payment receipt?
**Yes.** The whole standard-receipt family is transaction-bound:
`/v1/payments/{paymentId}/receipt`, `/v1/refunds/{refundId}/receipt`,
`/v1/credits/{creditId}/receipt`. The id in the path **is** the Clover
transaction. Source: [Print a receipt](https://docs.clover.com/dev/docs/printing-a-receipt)
("for any payment, credit, or refund") + the
[reference index](https://docs.clover.com/llms.txt).

### Q3. If yes, what is the recommended architecture for Stripe + Clover?
**Custom (text or image) receipt via the REST Pay Display API, reached over a
Cloud Pay Display connection.** The custom-print endpoints take only a
**printer id** and **arbitrary content** — no `paymentId`:

> The `/v1/device/print` endpoints require the printer's identifier in the
> request … body: `{ "printDeviceId": "{{printerid}}", "text": [ … ] }`.
> — [Print a receipt › Print a text receipt](https://docs.clover.com/dev/docs/printing-a-receipt)

A cloud backend can reach these endpoints if the merchant device runs the
**Cloud Pay Display** app:

> Cloud connection uses **Clover Cloud Server** and the **Cloud Pay Display
> App** on the device to broker messages between your POS app and the device.
> — [Connect your POS to the device](https://docs.clover.com/dev/docs/rest-pay-connection)

### Q4. If no, is a custom receipt the only supported approach?
**For a true *payment* receipt from a Stripe charge — yes.** Two alternatives
exist but are inferior:
- **`POST /v3/merchants/{mId}/print_event`** (cloud REST API) prints an **order
  / kitchen ticket**, requires a **Clover `orderId`**, and prints to the *order*
  printer — not a payment receipt. ([Print orders with the REST API](https://docs.clover.com/dev/docs/printing-orders-rest-api))
- Creating a Clover **bookkeeping payment record** on a Clover order yields a
  printable `paymentId`, but it is explicitly a logging/external-tender object
  that **pollutes merchant reporting** and never reconciles with the real Stripe
  settlement. ([reference](https://docs.clover.com/dev/reference/ordercreatepaymentfororder.md),
  indexed in [llms.txt](https://docs.clover.com/llms.txt)) — **not recommended.**

### Q5. What APIs are officially supported for this workflow?
| API | Surface | Needs | Use for Stripe? |
|---|---|---|---|
| `retrieve_printers` (`POST /v1/device/printers`) | REST Pay Display | connection + device | ✅ get printer id |
| `print_text_on_device` (`/v1/device/print`) | REST Pay Display | printer id + text[] | ✅ **primary** |
| `print_image_on_device` (`/v1/device/print`) | REST Pay Display | printer id + base64 PNG | ✅ alt (richer layout) |
| `get_print_job_status` | REST Pay Display | job id | ✅ confirm print |
| `deliver_payment_receipt` | REST Pay Display | **Clover paymentId** | ❌ no Clover payment |
| `POST /v3/merchants/{mId}/print_event` | Cloud REST (`api.clover.com`) | **Clover orderId** | ⚠️ order ticket only |

> ⚠️ **Compliance burden shifts to us.** Custom receipts are content-agnostic,
> so the doc warns twice: *"You are responsible to ensure the receipts printed by
> your app comply with all card brand rules, and all laws and regulations for the
> locale where the merchant operates."* — [Print a receipt](https://docs.clover.com/dev/docs/printing-a-receipt).
> We must render the card-brand-required fields ourselves (last 4, brand, auth,
> AID, etc.) — see §11.

---

## 1. Clover receipt printing — what the docs actually say

### Two printing options (REST Pay Display)
1. **Standard Clover receipt** — card-brand-compliant, auto-formatted; **requires a
   Clover transaction id** (`payment` / `credit` / `refund`). Body is fixed:
   `{ "deliveryOption": { "method": "PRINT" } }` (or `EMAIL` / `SMS`).
2. **Custom text/image receipt** — fully arbitrary content; **requires only the
   printer id**. This is the path we use for Stripe payments.

### Custom text receipt
- Endpoint family: `/v1/device/print` ([print_text_on_device](https://docs.clover.com/dev/reference/print_text_on_device)).
- Body: `{ "printDeviceId": "<id>", "text": ["LINE 1", "LINE 2", ""] }`.
- `text` is an **array of strings printed in order**; an empty string `""` is a
  **blank line** (vertical spacing). The printer is monochrome thermal; there is
  no rich formatting beyond line breaks and alignment we control.

### Custom image receipt
- Endpoint family: `/v1/device/print` ([print_image_on_device](https://docs.clover.com/dev/reference/print_image_on_device)).
- Body: `{ "printDeviceId": "<id>", "image": "<base64 PNG>" }`.
- **Black & white only; no alpha/transparency** ("the printer interprets
  transparent as black"). Base64 with no newlines. Optimize for size.
- Use this if we want logos, barcodes, or precise layout we can't do in text.

### Printer discovery
- `POST /v1/device/printers` (empty body) → `{ "printers": [ { "id": "YR8P3KTEW2182", "name": "Mini" } ] }`.
- The `id` is the `printDeviceId` used in print calls.
  ([retrieve_printers](https://docs.clover.com/dev/reference/retrieve_printers))

### Required headers & auth (REST Pay Display)
The page defers the exact list to the
[required-request-data](https://docs.clover.com/dev/docs/api-tutorials) anchor;
per REST Pay Display conventions and the cloud-connection request doc:
- `Authorization: Bearer {merch­ant OAuth access_token}`
- `X-Clover-Device-Id: {deviceSerial}` (target device)
- `X-POS-Id: {posId}` (our app identifier)
- `Content-Type: application/json`
- `Idempotency-Key: {key}` (optional; recommended on retries)

### Prerequisites to print at all
- An established REST Pay Display connection — **local** (`https://<device-ip>:12346/...`)
  **or cloud** (Cloud Pay Display + Clover Cloud Server).
- **Device is idle** (no payment being taken).
- **Printer id known.**

---

## 2. Order Printing vs Payment Receipt Printing

These are **two different surfaces** — easy to conflate, and the distinction
drives the architecture.

| | Print orders (`print_event`) | Print payment receipt |
|---|---|---|
| Doc section | POINT-OF-SALE › Manage orders | SEMI-INTEGRATE › REST Pay Display |
| Surface | **Cloud REST API** (`api.clover.com`) | **Semi-integration** (device) |
| Prints | Order / **kitchen** ticket | **Customer payment** receipt |
| Requires | Clover `orderId` | Clover `paymentId` (standard) **or** printer id (custom) |
| Auth | OAuth/API token (Bearer) | OAuth Bearer + device routing headers |
| Endpoint | `POST /v3/merchants/{mId}/print_event` | `/v1/device/print` (custom) or `/v1/payments/{id}/receipt` (standard) |

**For a Stripe payment, use the custom payment-receipt path** (REST Pay Display
`/v1/device/print`). Order printing is the wrong tool: it needs a Clover order
and prints to the kitchen printer, and a payment processed outside Clover has
neither a Clover order nor a Clover payment.

---

## 3. Cloud vs local — how our server reaches the printer

REST Pay Display is a **semi-integration** API. It is **not** on `api.clover.com`
(except the order `print_event`). Two ways to reach it:

- **Cloud connection (RECOMMENDED for this project).** Merchant device runs the
  **Cloud Pay Display** app; requests go to a region-specific Clover Cloud Server
  URL with `X-Clover-Device-Id` + OAuth token. No on-prem component from us;
  device just needs internet. Matches our Vercel deployment (ADR 0003).
  ([Configure a cloud connection](https://docs.clover.com/dev/docs/configuring-a-cloud-connection),
  [Build a cloud connection request](https://docs.clover.com/dev/docs/build-a-cloud-connection-request))
- **Local connection.** `https://<device-ip>:12346/...`; caller must be on the
  merchant LAN + trust the Clover CA. Requires a local gateway on-site.
  ([Build a local connection request](https://docs.clover.com/dev/docs/build-a-local-connection-connection))

> ⚠️ There is **no** pure `api.clover.com` endpoint that prints arbitrary text.
> The only server-side print endpoint (`print_event`) is order-scoped. So a
> cloud-only backend **requires Cloud Pay Display running** on the device — that
> is the one hard merchant-side dependency.

---

## 4. Stripe webhook — which event & how

### Event choice: `checkout.session.completed` (primary)
Per Stripe's own fulfillment guide, this is the canonical trigger:
> *"When someone pays you, it creates a `checkout.session.completed` event. Set up
> an endpoint on your server to accept, process, and confirm receipt of these
> events."* — [Fulfill Checkout orders](https://docs.stripe.com/checkout/fulfillment.md?payment-ui=stripe-hosted)

`data.object` **is** the Checkout Session — it carries `metadata.orderId`,
`payment_status`, line items, customer. `payment_intent.succeeded` fires for
**every** PaymentIntent account-wide (not just Checkout) and lacks Checkout
metadata, so it is the wrong trigger.

**Subscribe to three events** (delayed/async payment methods are the catch):
- `checkout.session.completed` — instant methods (cards, wallets).
- `checkout.session.async_payment_succeeded` — delayed methods (ACH, SEPA, …)
  succeed later; route to the **same** fulfillment function.
- `checkout.session.async_payment_failed` — notify on delayed failures.

Inside the handler, **re-fetch the session and assert `payment_status === 'paid'`**
before printing (async methods complete while still `unpaid`).

> Note: the existing webhook (`03-request-flows.md` §D) already handles
> `checkout.session.completed` to transition `pending_payment → paid`. We **extend**
> it to also enqueue the print job — we do not add a second endpoint.

### Signature verification (do not skip)
- Use `stripe.webhooks.constructEvent(rawBody, sigHeader, secret)` from the
  official SDK on the **raw** request body (Route Handler must read the stream;
  no JSON parse before verify).
- `Stripe-Signature` header: `t=<ts>,v1=<hmac>…`; HMAC-SHA256 of `"<ts>.<body>"`,
  default tolerance **5 min**.
- On parse/signature failure → **HTTP 400**. ([Webhooks](https://docs.stripe.com/webhooks))

### Idempotency (dedup duplicates + out-of-order)
- Stripe redelivers; two distinct Events can describe the same object.
- Dedup key = **Checkout Session id** (`cs_…`, the `metadata.orderId` maps 1:1 to
  our order). The existing `webhook_events.stripe_event_id` unique column is the
  first layer; the **print job** is guarded by a unique constraint on `order_id`
  (§9) so an order prints **at most once**.
- Handler must be safe under concurrent duplicate calls.

### Respond fast, background the slow work
> *"Quickly returns a successful status code (`2xx`) prior to any complex logic
> that might cause a timeout."* — [Webhooks](https://docs.stripe.com/webhooks)

The Clover HTTP call can take seconds and the device may be offline; it must
**never** block the webhook response. Return `2xx` after the order transition,
then **enqueue** the print. Stripe retries non-`2xx` for **up to 3 days**
exponential backoff — so failing the webhook to "retry the print" is wrong;
prints get their **own** retry queue (§12).

---

## 5–7. Required Clover setup & auth

### Merchant setup (one-time)
1. **Create a Clover app** on the [global developer platform](https://docs.clover.com/dev/docs/global-developer-platform-get-started)
   → get `client_id` / `client_secret`.
2. **Set app permissions** — REST Pay Display printing needs the device/print
   scopes. The print endpoints are governed by the REST Pay Display app's
   permissions; in practice the app needs access to **read printers** and
   **print**. (Exact permission strings live on the app-settings page; confirm
   against your app's required scopes before submission — the print-a-receipt
   page does not enumerate them.)
3. **OAuth flow** ([v2/OAuth](https://docs.clover.com/dev/docs/oauth-intro)):
   merchant authorizes → exchange auth code for an **access_token** (expiring)
   + **refresh_token**. Store both against the merchant.
4. **Install + start Cloud Pay Display** on the merchant device (prerequisite for
   a cloud connection).
5. **Capture identifiers:** `merchantId`, **device serial** (`X-Clover-Device-Id`),
   and **printer id** (via `/v1/device/printers`).
6. **Sandbox first:** `apisandbox.dev.clover.com` + a sandbox merchant/device, then
   production `api.clover.com`.

### Token lifecycle & refresh
- Access tokens are **expiring** (now required in all regions).
- Use the **refresh_token** to mint a new access token before expiry.
  ([Refresh tokens](https://docs.clover.com/dev/docs/refresh-access-tokens))
- Our `CloverClient` must handle `401` → refresh → retry once.

### Remote Pay vs REST API
- **REST API** (`api.clover.com`): merchant-scoped cloud calls (orders, inventory,
  `print_event`). OAuth/API token.
- **REST Pay Display** (this integration): device-scoped semi-integration calls,
  reached over Cloud Pay Display. Same OAuth token **plus** device-routing headers.
- **Remote Pay SDKs** (Clover Connector) are an alternate semi-integration path
  (heavier; WebSocket/Cloud SDK). We use **REST Pay Display** (simpler, HTTP).

---

## 8. Architecture

```
 Customer
   │  pays
   ▼
 Stripe Checkout  ──(success)──►  success_url (landing only, not confirmation)
   │
   │  checkout.session.completed  (+ async_payment_succeeded)
   ▼
 Stripe  ──HTTPS POST──►  POST /api/stripe/webhook  (our Next.js route)
   │                          │
   │                          ├─1. verify signature (raw body, 400 on fail)
   │                          ├─2. idempotency: webhook_events.stripe_event_id unique
   │                          ├─3. re-fetch session, assert payment_status=='paid'
   │                          ├─4. order: pending_payment → paid  (existing)
   │                          ├─5. enqueue print_job(status='queued')          ◄── extends existing handler
   │                          └─6. respond 200 FAST (before any Clover call)
   │
   ▼  (background worker / cron / route-in-transaction)
 ReceiptService.print(orderId)
   │  ├─ render receipt text from order + Stripe charge (last4, brand, auth…)
   │  ├─ load Clover merchant/device/printer for this store
   │  ├─ refresh OAuth token if 401
   │  └─ POST  {Cloud Pay Display base}/connect/v1/device/print   (CloverClient.printText)
   ▼
 Clover Cloud Server  ──relays──►  Cloud Pay Display app on device  ──►  thermal printer
   │
   ▼
 get_print_job_status  ──►  mark print_job.status = 'printed'  (or 'failed' → retry queue)
```

**Deployment fit (ADR 0003):** Next.js on Vercel + Postgres (Neon). The webhook
is a Route Handler. The "background worker" has two viable options on Vercel:

- **(A) Vercel Cron + DB queue (recommended for MVP):** a Cron route
  (`/api/cron/process-print-queue`) runs every minute, drains `print_jobs` in
  `queued`/`retry` state, prints, updates status. Simple, no extra infra.
- **(B) In-route `waitUntil` + QStash/Inngest:** enqueue to a durable queue on
  webhook receipt; a consumer calls Clover. More robust for high volume.

Start with **(A)**; upgrade to (B) if volume or latency demands it.

---

## 9. Database additions (`commerce` schema)

Extends `02-data-model.md`. All money columns already exist on `orders` (cents).

### `commerce.clover_merchants` (one row per Clover-linked store)
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `store_id` | text | soft ref to the StoreSettings/location this device serves |
| `merchant_id` | text | Clover `mId` |
| `access_token` | text (encrypted) | expiring OAuth token |
| `refresh_token` | text (encrypted) | |
| `token_expires_at` | timestamptz | |
| `region` | text | e.g. `us` / `eu` (selects cloud base URL) |
| `created_at` / `updated_at` | timestamptz | |

> Single restaurant ⇒ one row for MVP. Model is multi-store-ready.

### `commerce.clover_devices`
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `clover_merchant_id` | uuid fk → clover_merchants | |
| `device_serial` | text | the `X-Clover-Device-Id` |
| `name` | text | human label |
| `active` | boolean | |
| `created_at` / `updated_at` | timestamptz | |

### `commerce.clover_printers`
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `clover_device_id` | uuid fk → clover_devices | |
| `printer_id` | text | the `printDeviceId` from `/v1/device/printers` |
| `name` | text | e.g. "Mini" |
| `is_default` | boolean | the printer to use for receipts |
| `last_seen_at` | timestamptz | refreshed on discovery |
| `created_at` / `updated_at` | timestamptz | |

### `commerce.print_jobs` (the retry + idempotency record)
| column | type | notes |
|---|---|---|
| `id` | uuid pk | |
| `order_id` | uuid fk → orders (**unique**) | **one print per order — idempotency** |
| `clover_printer_id` | uuid fk → clover_printers | |
| `payload` | jsonb | rendered text[] / snapshot |
| `status` | enum(`queued`,`printing`,`printed`,`failed`,`skipped`) | |
| `attempts` | int default 0 | |
| `last_error` | text, nullable | |
| `next_retry_at` | timestamptz, nullable | backoff schedule |
| `clover_job_id` | text, nullable | from `get_print_job_status` |
| `created_at` / `updated_at` | timestamptz | |

> The existing `webhook_events` table is **unchanged** — it stays the Stripe
> idempotency log. `print_jobs.order_id` unique is the print-side idempotency:
> redelivered webhooks / retry storms can never print twice.

---

## 10. API / service design

```
app/api/stripe/webhook/route.ts        # EXTENDS existing: enqueue print_job after 'paid'
app/api/cron/process-print-queue/route.ts  # NEW: drains print_jobs (CRON_SECRET gated)

src/server/clover/client.ts             # CloverClient: thin HTTP wrapper (REST Pay Display)
src/server/clover/receipt.ts            # ReceiptService: order → rendered text[] 
src/server/clover/print-queue.ts        # enqueue / drain / retry logic
src/server/clover/format.ts             # money, dates, card fields → receipt lines
src/server/clover/auth.ts               # token store + refresh-on-401
src/lib/clover/receipt-lines.ts         # pure renderer (unit-testable)
```

### `POST /api/stripe/webhook` (extended flow)
```
verify signature → 400 on fail
tx:
  insert webhook_events(stripe_event_id) ON CONFLICT → 200 (already seen)
  switch type:
    checkout.session.completed | async_payment_succeeded:
      session = stripe.checkout.sessions.retrieve(id, {expand:['line_items','payment_intent']})
      if session.payment_status != 'paid' → 200 (wait for async)
      order: pending_payment → paid; store charge/PI ids
      print_jobs: INSERT (order_id, status='queued') ON CONFLICT (order_id) DO NOTHING
    async_payment_failed:
      log / notify (no print)
commit; respond 200  ← fast, before any Clover call
```

### `CloverClient` (REST Pay Display over Cloud Pay Display)
```ts
class CloverClient {
  // POST {base}/connect/v1/device/printers
  listPrinters(deviceSerial): Promise<Printer[]>
  // POST {base}/connect/v1/device/print   (print_text_on_device)
  printText(deviceSerial, printerId, text: string[], idemKey: string): Promise<{ jobId?: string }>
  // image variant: printImage(deviceSerial, printerId, base64Png, idemKey)
  // GET/POST {base}/connect/v1/device/print/.../{jobId}  (get_print_job_status)
  getPrintJobStatus(deviceSerial, jobId): Promise<JobStatus>
}
// headers: Authorization Bearer, X-Clover-Device-Id, X-POS-Id, Idempotency-Key, Content-Type json
// 401 → auth.refresh() → retry once. 503/504 → retryable. 400/501 → terminal.
```
- `base` is the **region-specific Clover Cloud Server URL** (from
  [build-a-cloud-connection-request](https://docs.clover.com/dev/docs/build-a-cloud-connection-request)).
  Store per-merchant; do not hardcode.
- `Idempotency-Key` = `print_jobs.id` so a retried HTTP call cannot double-print.

### `ReceiptService.print(orderId)`
```
job = print_jobs.byOrderId(orderId)            # bail if none / already printed
device, printer = resolveActivePrinter()       # active device + default printer
text = renderReceipt(order, charge)            # §11
job.status = 'printing'
try:
  res = clover.printText(device.serial, printer.id, text, idemKey=job.id)
  status = clover.getPrintJobStatus(...)       # best-effort confirm
  job.status = 'printed'
catch e:
  job.attempts++; job.last_error = e; scheduleRetry(job)   # §12
```

### `OrderService.completeOrder` — unchanged
Order state transitions stay owned by the webhook (`paid`) and owner actions
(`ready`/`completed`). Printing is a **side effect** of `paid`, not a state.

---

## 11. Receipt content & rendering

**Render server-side** from the order + the Stripe charge. Clover does **not**
generate anything for us (no Clover payment object). Required/expected fields:

| Section | Source | Notes |
|---|---|---|
| Merchant name + address + phone | `StoreSettings` | header |
| **Order number** (`EQ-1042`) | `orders.order_number` | biggest, prominent |
| Pickup time / mode | `orders.pickup_at`, `pickup_mode` | "PICKUP — 12:30 PM" |
| Line items + modifiers | `order_line_items` | name, qty, selected options, line total |
| Subtotal / discount / tax / tip / **total** | `orders.*` (cents) | format `$XX.XX` |
| **Card brand + last4** | Stripe `charge.payment_method_details.card` | card-brand required |
| **Auth / reference** | Stripe `charge.id` / PI id | card-brand recommended |
| Payment method note | "Paid online (Stripe)" | clarifies it's not a Clover charge |
| Customer name / phone | `orders.customer_*` | |
| Timestamp | `charge.created` → restaurant TZ | `StoreSettings.timezone` |
| Footer (thank you / reorder url) | `StoreSettings` | optional |

- Money: stored cents → `Intl.NumberFormat('en-US',{style:'currency',currency:'USD'})`.
- Dates: `date-fns-tz` in `StoreSettings.timezone`.
- Width: Clover receipt printers are ~32 monospace cols (Mini/Flex) / 48 (Station).
  Wrap/center accordingly. An empty `""` array element = blank line.
- **Image variant** (`print_image_on_device`): if we want a logo or precise
  layout, render the whole receipt to a B/W PNG (no alpha) server-side (e.g.
  `@resvg/resvg-js` or a canvas). Heavier; defer unless text is insufficient.

> Because the receipt is custom, **we** own card-brand compliance (last4, brand,
> auth, AID for chip, signature line if required by brand/region). See Risks §15.

---

## 12. Failure handling & retries

Two independent retry layers — **do not** fail the Stripe webhook to retry prints.

**Stripe layer** (webhook → our server): only fails on signature/parse (400) or
our internal error (500). Order transition failing → 500 lets Stripe retry the
*event*; idempotency (`webhook_events`) keeps it safe.

**Clover layer** (print queue):
```
on Clover error:
  classify:
    401 → refresh token, retry once now
    503/504/timeout/network → retryable
    400/401(after refresh)/501 → terminal → status='failed', alert
  retryable → attempts++, next_retry_at = now + backoff(attempts)
             backoff = min(60s * 2^attempts, 15min), cap total ~24h
             status='queued' (drained by cron)
device offline → print_job stays 'queued'; cron retries until device back
printed → status='printed'; stop
```
- Cron (`/api/cron/process-print-queue`) runs ~1/min, drains `queued` and
  `next_retry_at <= now` rows.
- Dead-letter: after N attempts (e.g. 20) or 24h, `failed` + owner alert
  (email/Slack) so staff can manually reprint from the owner dashboard.
- `get_print_job_status` confirms physical print when available; treat its
  absence (job discarded after success per docs) as success if HTTP returned ok.

---

## 13. Idempotency (no duplicate prints)

Three layers, each independent:
1. **Webhook:** `webhook_events.stripe_event_id` unique → redelivered events
   ack-and-stop.
2. **Print enqueuing:** `print_jobs.order_id` **unique** → one job per order, ever.
3. **Clover HTTP:** `Idempotency-Key` = `print_jobs.id` → a retried HTTP call to
   Clover cannot double-print.

Handled cases: duplicate webhook delivery (✓ layer 1+2), Stripe out-of-order
events (✓ re-fetch + status guard), Clover timeout-then-retry (✓ layer 3),
concurrent cron runs (✓ `SELECT … FOR UPDATE SKIP LOCKED` on the drain query).

---

## 14. Testing checklist

**Stripe (sandbox/test mode)**
- [ ] `stripe listen --forward-to localhost:3000/api/stripe/webhook` works;
  signature verifies with local `whsec_`.
- [ ] `stripe trigger checkout.session.completed` → order → `paid`, print_job
  `queued`.
- [ ] Re-deliver same event (`stripe events resend`) → no second print_job
  (unique `order_id`), webhook still `200`.
- [ ] Async method (e.g. SEPA/ACH test) → `async_payment_succeeded` prints;
  `async_payment_failed` does not.
- [ ] Tampered body → `400`. Stale timestamp (>5min) → `400`.

**Clover (sandbox device + Cloud Pay Display)**
- [ ] OAuth flow completes; tokens stored; refresh works.
- [ ] `/v1/device/printers` returns the device printer; `clover_printers` seeded.
- [ ] `print_text_on_device` prints a sample receipt.
- [ ] End-to-end: pay in Stripe test mode → receipt prints on Clover.
- [ ] `print_image_on_device` prints a B/W PNG (no black-box from alpha).

**Offline / failure**
- [ ] Device off → print_job stays `queued`; cron retries; comes back online →
  prints.
- [ ] Simulate `503` → backoff + retry; eventual `printed`.
- [ ] Token expiry → `401` → refresh → retry → prints.
- [ ] Terminal error (e.g. printer removed) → `failed` + alert.
- [ ] Concurrent cron runs → no double print (`FOR UPDATE SKIP LOCKED`).

---

## 15. Final deliverables — risks, limitations, blockers

### ✅ Blocker resolution
**Clover cannot print its *standard* payment receipt for a Stripe charge**
(standard endpoints need a Clover `paymentId` that doesn't exist). This is **not
a project blocker** — the **custom text/image receipt** path is officially
supported and fully sufficient. It shifts card-brand receipt compliance onto us
(we render last4/brand/auth). ([Print a receipt](https://docs.clover.com/dev/docs/printing-a-receipt))

### ⚠️ Hard dependencies / limitations
1. **Cloud Pay Display app must be installed + running** on the merchant device,
   and the device must be **online**. This is the single on-site requirement; no
   on-prem gateway from us is needed. ([Configure a cloud connection](https://docs.clover.com/dev/docs/configuring-a-cloud-connection))
2. **No server-only arbitrary-text print on `api.clover.com`.** The only cloud
   print endpoint (`print_event`) needs a Clover order and prints a kitchen
   ticket — wrong for a payment receipt.
3. **Card-brand compliance is our responsibility** for custom receipts (last4,
   brand, auth code, AID, signature line where required).
4. **Device must be idle** to print (no concurrent Clover payment) — fine for a
   pickup-only restaurant.
5. **OAuth tokens expire** — refresh logic + 401 handling is mandatory, not optional.
6. **get_print_job_status** only returns `CREATED`/`PRINTING`/`FAILED`; a printed
   job is discarded and unreplayable — treat successful HTTP + absent status as
   success. ([Print orders](https://docs.clover.com/dev/docs/printing-orders-rest-api))

### 🔑 Required configuration
**Clover**
- Developer app (`client_id`/`client_secret`), app permissions (printers/print).
- OAuth: `access_token` + `refresh_token` per merchant.
- `merchantId`, device serial (`X-Clover-Device-Id`), printer id, region.

**Stripe**
- Webhook endpoint (HTTPS) subscribed to `checkout.session.completed`,
  `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
- `metadata.orderId` on the Checkout Session (already in the existing flow).

### 🔐 Environment variables (`.env.example`)
```
# Stripe (existing) — webhook secret for signature verification
STRIPE_WEBHOOK_SECRET=whsec_...

# Clover
CLOVER_CLIENT_ID=...
CLOVER_CLIENT_SECRET=...
CLOVER_POS_ID=el-quetzalito      # X-POS-Id
CLOVER_REGION=us                 # selects cloud base URL
# Per-merchant (store encrypted in clover_merchants, not env) — shown for dev:
CLOVER_MERCHANT_ID=...
CLOVER_DEVICE_SERIAL=...         # X-Clover-Device-Id
CLOVER_PRINTER_ID=...            # printDeviceId
CLOVER_ACCESS_TOKEN=...          # dev only; prod = DB + encrypted
CLOVER_REFRESH_TOKEN=...

# Cron
CRON_SECRET=...                  # gates /api/cron/process-print-queue
```

### ✅ Production checklist
- [ ] Signature verification on raw body; 400 on failure.
- [ ] Webhook returns `200` before any Clover call (background the print).
- [ ] `webhook_events` idempotency + `print_jobs.order_id` unique.
- [ ] Token refresh-on-401; encrypted token storage.
- [ ] Print queue w/ backoff + dead-letter + owner alert.
- [ ] `SELECT … FOR UPDATE SKIP LOCKED` on the queue drain.
- [ ] Card-brand fields rendered on every receipt.
- [ ] Cron gated by `CRON_SECRET`; monitoring on queue depth + `failed` jobs.
- [ ] Sandbox → production cutover (`apisandbox.dev.clover.com` → `api.clover.com`).
- [ ] `pnpm typecheck && pnpm lint && pnpm build` green.

### 📚 Official references
- [Print a receipt (REST Pay Display)](https://docs.clover.com/dev/docs/printing-a-receipt)
- [Print orders with the REST API](https://docs.clover.com/dev/docs/printing-orders-rest-api)
- [Deliver a payment receipt (reference)](https://docs.clover.com/dev/reference/deliver_payment_receipt)
- [print_text_on_device](https://docs.clover.com/dev/reference/print_text_on_device) ·
  [print_image_on_device](https://docs.clover.com/dev/reference/print_image_on_device) ·
  [retrieve_printers](https://docs.clover.com/dev/reference/retrieve_printers) ·
  [get_print_job_status](https://docs.clover.com/dev/reference/get_print_job_status)
- [REST Pay Display connection (cloud vs local)](https://docs.clover.com/dev/docs/rest-pay-connection) ·
  [Configure a cloud connection](https://docs.clover.com/dev/docs/configuring-a-cloud-connection) ·
  [Build a cloud connection request](https://docs.clover.com/dev/docs/build-a-cloud-connection-request)
- [v2/OAuth overview](https://docs.clover.com/dev/docs/oauth-intro) ·
  [Refresh tokens](https://docs.clover.com/dev/docs/refresh-access-tokens)
- [Clover webhooks](https://docs.clover.com/dev/docs/webhooks) ·
  [llms.txt index](https://docs.clover.com/llms.txt)
- [Stripe webhooks](https://docs.stripe.com/webhooks) ·
  [Create webhook endpoint](https://docs.stripe.com/api/webhook_endpoints/create) ·
  [Fulfill Checkout orders](https://docs.stripe.com/checkout/fulfillment.md?payment-ui=stripe-hosted)
