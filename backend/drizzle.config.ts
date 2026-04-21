const dotenv = require("dotenv");
dotenv.config();
const drizzle = require("drizzle-kit");
const {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
} = process.env;
const config = drizzle.defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: DATABASE_URL,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
  },
});
module.exports = config;
