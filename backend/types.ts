import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sessions, tasks, users } from "./config/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

/** Row from `sessions` table — not the same as `express-session`’s `req.session`. */
export type DbSession = InferSelectModel<typeof sessions>;
export type NewDbSession = InferInsertModel<typeof sessions>;
