import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { joinRequests, sessions, tasks, teams, users } from "./config/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export type Team = InferSelectModel<typeof teams>;
export type NewTeam = InferInsertModel<typeof teams>;

/** Row from `sessions` table — not the same as `express-session`’s `req.session`. */
export type DbSession = InferSelectModel<typeof sessions>;
export type NewDbSession = InferInsertModel<typeof sessions>;

export type JoinRequest = InferSelectModel<typeof joinRequests>;
export type NewJoinRequest = InferInsertModel<typeof joinRequests>;
