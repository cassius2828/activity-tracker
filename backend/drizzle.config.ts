import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env;

export default defineConfig({
  dialect: "postgresql",
  schema: "./config/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL!,
    database: DATABASE_NAME!,
    user: DATABASE_USER!,
    password: DATABASE_PASSWORD!,
    port: DATABASE_PORT ? Number(DATABASE_PORT) : undefined,
  },
});
