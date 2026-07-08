import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@payloadcms/next"],
  serverExternalPackages: [
    "payload",
    "@payloadcms/db-postgres",
    "@payloadcms/drizzle",
    "drizzle-kit",
    "drizzle-orm",
    "pg",
    "postgres",
  ],
};

export default nextConfig;
