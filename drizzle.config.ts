import { defineConfig } from "drizzle-kit";

// Use a default database URL for development if not provided
const databaseUrl = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/defaultdb";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
