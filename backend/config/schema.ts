import type { AnyPgColumn } from "drizzle-orm/pg-core";
const {
  pgTable,
  integer,
  text,
  timestamp,
  primaryKey,
  pgEnum,
  index,
  uniqueIndex,
} = require("drizzle-orm/pg-core");

const users = pgTable(
  "users",
  {
    id: primaryKey({ columns: [integer()] }),
    email: text().notNull().unique(),
    role: pgEnum("role", ["admin", "user"]).notNull().default("user"),
    password: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table: {
    email: AnyPgColumn;
    role: AnyPgColumn;
    createdAt: AnyPgColumn;
  }) => [
    uniqueIndex("idx_users_email").on(table.email),
    index("idx_users_role").on(table.role),
    index("idx_users_createdAt").on(table.createdAt),
  ],
);

const tasks = pgTable(
  "tasks",
  {
    id: primaryKey({ columns: [integer()] }),
    userId: integer().references(() => users.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text().notNull(),
    dueDate: timestamp(),
    priority: pgEnum("priority", ["none", "low", "medium", "high"])
      .notNull()
      .default("none"),
    category: pgEnum("category", ["work", "personal", "other"])
      .notNull()
      .default("other"),
    status: pgEnum("status", ["pending", "completed", "in_progress"])
      .notNull()
      .default("pending"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table: {
    userId: AnyPgColumn;
    dueDate: AnyPgColumn;
    priority: AnyPgColumn;
    category: AnyPgColumn;
    status: AnyPgColumn;
  }) => [
    index("idx_tasks_userId").on(table.userId),
    index("idx_tasks_dueDate").on(table.dueDate),
    index("idx_tasks_priority").on(table.priority),
    index("idx_tasks_category").on(table.category),
    index("idx_tasks_status").on(table.status),
  ],
);

const sessions = pgTable(
  "sessions",
  {
    id: primaryKey({ columns: [text()] }),
    userId: integer()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text().notNull(),
    expiresAt: timestamp().notNull(),
    revokedAt: timestamp(),
    ipAddress: text().notNull(),
    userAgent: text().notNull(),
    deviceName: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    lastUsedAt: timestamp().notNull().defaultNow(),
  },
  (table: {
    userId: AnyPgColumn;
    tokenHash: AnyPgColumn;
    createdAt: AnyPgColumn;
    updatedAt: AnyPgColumn;
    ipAddress: AnyPgColumn;
    revokedAt: AnyPgColumn;
  }) => [
    index("idx_sessions_userId").on(table.userId),
    index("idx_sessions_tokenHash").on(table.tokenHash),
    index("idx_sessions_createdAt").on(table.createdAt),
    index("idx_sessions_updatedAt").on(table.updatedAt),
    index("idx_sessions_ipAddress").on(table.ipAddress),
    index("idx_sessions_revokedAt").on(table.revokedAt),
  ],
);

module.exports = { users, tasks, sessions };
