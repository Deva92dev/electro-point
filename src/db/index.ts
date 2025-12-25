import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const globalQueryClient = global as unknown as { neonPool: Pool };

// Reuse existing connection if in Dev, or create new one
const pool =
  globalQueryClient.neonPool ||
  new Pool({ connectionString: process.env.DATABASE_URL });

// Save the connection globally in Dev so we don't reconnect on every reload
if (process.env.NODE_ENV !== "production") {
  globalQueryClient.neonPool = pool;
}

export const db = drizzle(pool, { schema });
