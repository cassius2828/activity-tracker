/** Shared Drizzle client + Postgres pool (singleton for the process). */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Many hosted Postgres URLs use TLS certs Node doesn't trust by default
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);

export default db;
