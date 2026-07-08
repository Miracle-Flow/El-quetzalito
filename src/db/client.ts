import { drizzle } from "drizzle-orm/node-postgres";
import { pgSchema } from "drizzle-orm/pg-core";
import { Pool } from "pg";

const rawDatabaseUrl = process.env.DATABASE_URL;

if (!rawDatabaseUrl && process.env.NODE_ENV !== "test") {
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = rawDatabaseUrl ?? "";

export const pool = new Pool({ connectionString });

export const commerceSchema = pgSchema("commerce");

export const db = drizzle(pool, { schema: { commerceSchema } });
