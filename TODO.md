# TODO — Client Confirmation Required Before Launch

## Menu Items Added from Images (Prices & Availability Unconfirmed)

The following items were added to the menu based on photos in `public/Menu/`. **Confirm with the client whether each item is actually sold and verify all prices before launching the site.**

### Especiales / Special Platters
| Item | Current Price | Confirm? |
|------|--------------|---------|
| Costillas BBQ | $18.00 | ✅ Verify price |
| Alitas BBQ | $14.00 | ✅ Verify price |
| Pepián de Gallina o Res | $14.00 | ✅ Verify if standalone item (also in daily specials) |

### Appetizers / Aperitivos
| Item | Current Price | Confirm? |
|------|--------------|---------|
| Shuco Maya York | $17.00 | ✅ Verify price & if separate from Shuco Tradicional |
| Tacos Dorados de Pollo o Papa (3 pcs) | $12.00 | ✅ Verify price |
| Gringas | $15.00 | ✅ Verify price |
| Nuggets de Pollo con Papas Fritas | $12.00 | ✅ Verify price |
| Alitas de Pollo con Papas Fritas | $14.00 | ✅ Verify price & if different from Alitas BBQ |
| Hot Dog Chapín | $8.00 | ✅ Verify price |
| Ensalada Mixta | $10.00 | ✅ Verify price |
| Ensalada de Pollo | $12.00 | ✅ Verify price |
| Ensalada de Coditos | $8.00 | ✅ Verify price |

### Panadería / Bakery (entire new category — confirm they sell these)
| Item | Current Price | Confirm? |
|------|--------------|---------|
| Pan de Anís | $2.50 | ✅ Verify price |
| Cuernitos | $2.50 | ✅ Verify price |
| Cubilete | $3.00 | ✅ Verify price |
| Somanteca | $2.50 | ✅ Verify price |
| Cortado | $3.00 | ✅ Verify price |
| Milhojas | $3.50 | ✅ Verify price |
| Cachito | $2.50 | ✅ Verify price |
| Pan Comania | $2.50 | ✅ Verify price |

### Jugos / Juices (new subsection in drinks)
| Item | Current Price | Confirm? |
|------|--------------|---------|
| Naranja / Orange | $5.00 | ✅ Verify price |
| Jugo Verde (Manzana, Kiwi, Limón) | $7.00 | ✅ Verify price |
| Piña Colada | $8.00 | ✅ Verify price |

---

## Other Pre-Launch Checks

- [ ] Remove the entire **Panadería / Bakery** category if the client does not sell bakery items
- [ ] Confirm the "Sopa de Gallina" image is only for daily specials or if it should also appear as a standalone item
- [ ] Confirm whether "Guisado de Res" should appear as a standalone special or only as a daily special
- [ ] Review all item descriptions and correct any inaccuracies with client input

---

# Security & Infrastructure — Before Client Handoff

Everything below must be done once the client provides real credentials. Right now
`.env.local` holds **placeholder values only** (localhost DB, `sk_test_placeholder`,
`whsec_placeholder`), so payments and data will not work in production until these
are replaced.

## Database (`DATABASE_URL`)

- [ ] Provision the client's **production Postgres** (Neon / Supabase / RDS, etc.) and put its
      connection string in Vercel — do **not** use the `localhost` placeholder.
- [ ] Require TLS on the connection: append `?sslmode=require` (or the provider's equivalent)
      to `DATABASE_URL`.
- [ ] Use a **pooled/serverless-safe** connection. Vercel functions are serverless and the
      raw `pg` Pool can exhaust Postgres connections under load — use the provider's pooled
      connection string (e.g. Neon pooler / PgBouncer) or a serverless driver.
- [ ] Run migrations against the production DB **before first traffic**:
      Payload tables + the `commerce` schema (`pnpm db:migrate`). Confirm the `commerce`
      and `payload` schemas both exist.
- [ ] Verify no seed/test data or dummy orders remain in the production DB.

## Environment variables (set in Vercel → Settings → Environment Variables)

Set for **Production** (and **Preview** if branch deploys are used). None of these may be
committed to git (`.env*` is already gitignored — keep it that way).

- [ ] `DATABASE_URL` — real production connection string (see above)
- [ ] `PAYLOAD_SECRET` — generate a **fresh** strong secret for production
      (`openssl rand -hex 32`); do not reuse the dev value. Changing it later invalidates
      all existing admin sessions/tokens, so set it once and keep it stable.
- [ ] `STRIPE_SECRET_KEY` — client's real key (`sk_live_...` for going live)
- [ ] `STRIPE_WEBHOOK_SECRET` — `whsec_...` from the **production** webhook endpoint
      (test-mode and live-mode webhooks have different secrets)
- [ ] `NEXT_PUBLIC_SERVER_URL` — the real production domain (e.g. `https://elquetzalito.com`),
      **not** `localhost`. This drives Stripe success/cancel redirect URLs, so a wrong value
      silently breaks checkout redirects.

## Stripe

- [ ] Decide test vs. live mode and use the matching key set consistently
      (`sk_`/`whsec_` must both be test, or both be live).
- [ ] Register the production webhook in the Stripe dashboard pointing at
      `https://YOURDOMAIN/api/stripe/webhook`, subscribe to the events the app handles
      (`checkout.session.completed`, `charge.refunded`, `refund.updated`, and the
      payment-intent events), then copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
- [ ] Revisit the key guard in `src/lib/stripe.ts` (`getSecretKey`) — it currently warns
      whenever the key is not `sk_test_...`. Confirm this is only a warning (it does not block
      live keys) and adjust the messaging for production if desired.
- [ ] Send a Stripe test webhook to the deployed endpoint and confirm a `200` response and a
      row written to `webhook_events`.

## Payload CMS / admin

- [ ] Create the client's **admin account** on first `/admin` visit; remove any dev/test users.
- [ ] Configure Payload `cors` and `csrf` in `payload.config.ts` to the production domain only
      (currently unset — defaults are permissive).
- [ ] Confirm `/admin` and the Payload REST/GraphQL APIs are not exposing data that should be
      private.

## Deploy hygiene

- [ ] Remove the stray **`package-lock.json`** from `El-quetzalito/` — the project uses pnpm
      (`pnpm-lock.yaml`), and having both lockfiles triggers Vercel's "multiple lockfiles"
      workspace-root warning and can cause the wrong package manager to be used.
- [ ] Confirm the Vercel project's **Root Directory** is set to the `El-quetzalito` folder and
      the install/build uses pnpm.
- [ ] Confirm `.env.local` and any real secrets are never committed (verify with
      `git ls-files | grep env`).
- [ ] Consider rate-limiting the public API routes (`/api/stripe/webhook`, checkout actions)
      to mitigate abuse.
- [ ] After deploy, smoke-test the full order → Stripe checkout → webhook → order-status flow
      against the production DB.

> **Note:** The build itself no longer requires `DATABASE_URL` to be present — `src/db/client.ts`
> now connects lazily, so Vercel builds succeed even before the DB env var is set. These
> variables are still required for the app to **function** at runtime.
