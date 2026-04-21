const drizzleOrm = require("drizzle-orm");
const { integer, text, timestamp, pgTable, primaryKey, pgEnum } = drizzleOrm.pgTable;

const users = pgTable("users", {
  id: primaryKey({ columns: [integer()] }),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

const tasks = pgTable("tasks", {
  id: primaryKey({ columns: [integer()] }),
  userId: integer().references(() => users.id),
  title: text().notNull(),
  description: text().notNull(),
  dueDate: timestamp(),
  priority: pgEnum("priority", ["none","low", "medium", "high"]).notNull().default("none"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

module.exports = { users, tasks };
