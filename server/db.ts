import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Use a default database URL for development if not provided
const databaseUrl = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/defaultdb";

const sql = neon(databaseUrl);
export const db = drizzle(sql);