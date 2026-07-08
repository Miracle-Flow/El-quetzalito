# ADR-0003: Deploy on Vercel with Neon Postgres

- **Status:** Accepted
- **Date:** 2026-07-08

## Context

ADR-0001 chose Payload CMS self-hosted **inside** the Next.js app with a Postgres
adapter, and Drizzle for transactional commerce on the same Postgres database.
This ADR records where that combined app + database runs. The choice is
constrained by: Payload's runtime model (it prefers a long-running process but
officially supports Next.js on Vercel), the need for managed Postgres, and thin
operational overhead for a single restaurant.

## Decision

- **Application: Vercel** — the Next.js app (public storefront + Payload admin +
  Local API + Drizzle queries + Stripe webhooks + Resend sends) deploys on
  Vercel.
- **Database: Neon** — managed serverless Postgres, hosting both Payload's
  catalog collections and Drizzle's commerce tables in one database. Neon's
  database branching is used for dev/preview environments.

## Consequences

**Positive**
- Next.js-native hosting with preview deployments per PR and generous free-tier
  pricing appropriate for a single restaurant's traffic.
- Payload 3.x running inside Next.js on Vercel is an officially supported
  configuration.
- Neon provides managed Postgres without operating a server, with copy-on-write
  branches that pair naturally with Vercel preview deploys.
- One database for both Payload and Drizzle (per ADR-0001) keeps the boundary
  logical rather than physical.

**Negative**
- Vercel runs the app as serverless functions: cold starts and per-request
  execution limits apply. Acceptable for a single restaurant's volume, but
  Payload's persistent-process preferences mean we may hit friction (e.g., on
  the admin or long-running tasks). Fallback is a long-running Node host.
- Environment variables (Stripe keys, Resend key, Neon connection string, Payload
  secret) must be configured across Vercel environments (preview/production) and
  kept in sync with local `.env`.
- Database backups, connection-pooling, and neon compute-scaling need to be
  understood before launch.

## Alternatives considered

- **Long-running Node host (Railway / Fly.io / Render)** hosting app + managed
  Postgres on one platform. Friendlier to Payload's persistent-process model
  (no cold starts) and simpler mental model (one platform). Rejected as the
  *initial* choice in favor of Vercel's Next.js DX and preview deploys; remains
  the documented fallback if Payload-on-serverless proves problematic.
- **Vercel + Supabase.** Viable; Supabase also bundles auth/storage for later
  phases. Rejected in favor of Neon's leaner pure-Postgres offering and superior
  dev-branching, since auth is out of scope for the MVP (guest-only).
- **Self-managed VPS.** Rejected: unnecessary operational burden for a single
  restaurant when managed platforms cover the needs.
