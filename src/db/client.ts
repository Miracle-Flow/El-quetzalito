import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { pgSchema } from "drizzle-orm/pg-core";
import { Pool } from "pg";

// `commerceSchema` never needs a live connection, so it stays a plain
// top-level export used by the schema definitions.
export const commerceSchema = pgSchema("commerce");

const schema = { commerceSchema };

function getConnectionString(): string {
  const rawDatabaseUrl = process.env.DATABASE_URL;

  if (!rawDatabaseUrl && process.env.NODE_ENV !== "test") {
    throw new Error("DATABASE_URL environment variable is required");
  }

  return rawDatabaseUrl ?? "";
}

// Lazily create the pool/drizzle client so importing this module (e.g. when
// Next.js collects page data at build time) never opens a connection or throws
// for a missing DATABASE_URL. The connection is established on first use.
let poolInstance: Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

function getPool(): Pool {
  poolInstance ??= new Pool({ connectionString: getConnectionString() });
  return poolInstance;
}

function getDb(): NodePgDatabase<typeof schema> {
  dbInstance ??= drizzle(getPool(), { schema });
  return dbInstance;
}

function lazyProxy<T extends object>(resolve: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = resolve();
      const value: unknown = Reflect.get(instance, prop, instance);
      if (typeof value === "function") {
        return (value as (...args: unknown[]) => unknown).bind(instance);
      }
      return value;
    },
  });
}

export const pool = lazyProxy(getPool);

export const db = lazyProxy(getDb);
