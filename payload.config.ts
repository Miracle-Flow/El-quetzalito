import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { collections } from "./src/payload/collections/index.ts";
import { globals } from "./src/payload/globals/index.ts";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  serverURL,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
    schemaName: "payload",
  }),
  collections,
  globals,
  admin: {
    user: "users",
  },
});
