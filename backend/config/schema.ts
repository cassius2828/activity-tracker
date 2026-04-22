import crypto from "node:crypto";
import {
  pgTable,
  integer,
  text,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);
export const priorityEnum = pgEnum("priority", [
  "none",
  "low",
  "medium",
  "high",
]);
export const categoryEnum = pgEnum("category", ["work", "personal", "other"]);
export const statusEnum = pgEnum("status", [
  "pending",
  "completed",
  "in_progress",
]);

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().notNull().unique(),
    role: roleEnum().notNull().default("user"),
    password: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_users_email").on(table.email),
    index("idx_users_role").on(table.role),
    index("idx_users_createdAt").on(table.createdAt),
  ],
);

export const tasks = pgTable(
  "tasks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => users.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text().notNull(),
    dueDate: timestamp(),
    priority: priorityEnum().notNull().default("none"),
    category: categoryEnum().notNull().default("other"),
    status: statusEnum().notNull().default("pending"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    index("idx_tasks_userId").on(table.userId),
    index("idx_tasks_dueDate").on(table.dueDate),
    index("idx_tasks_priority").on(table.priority),
    index("idx_tasks_category").on(table.category),
    index("idx_tasks_status").on(table.status),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
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
  (table) => [
    index("idx_sessions_userId").on(table.userId),
    index("idx_sessions_tokenHash").on(table.tokenHash),
    index("idx_sessions_createdAt").on(table.createdAt),
    index("idx_sessions_updatedAt").on(table.updatedAt),
    index("idx_sessions_ipAddress").on(table.ipAddress),
    index("idx_sessions_revokedAt").on(table.revokedAt),
  ],
);
