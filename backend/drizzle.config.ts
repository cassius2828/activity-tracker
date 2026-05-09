import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const {
  DATABASE_URL,
} = process.env;

export default defineConfig({
  dialect: "postgresql",
  schema: "./config/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
