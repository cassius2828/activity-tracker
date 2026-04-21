const dotenv = require("dotenv");
dotenv.config();
const {drizzle} = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const db = drizzle(pool);
module.exports = db;
