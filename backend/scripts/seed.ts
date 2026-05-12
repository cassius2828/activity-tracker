/**
 * Idempotent dev seed: 10 fake users (password "123"), 3 teams, personal tasks
 * per user, and team tasks owned by random team members.
 *
 * Real accounts listed in EXISTING_USER_EMAILS also receive personal tasks.
 * Their password / role / teamId are never modified; if they already belong to
 * one of the seeded teams, they're eligible to own team tasks too.
 *
 * Re-running is safe for users/teams (looked up by email/name), but task rows
 * are inserted unconditionally — running twice doubles task counts.
 *
 * Run from backend/: `npm run seed`
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { eq, inArray } from "drizzle-orm";
import { db } from "../config/db";
import { tasks, teams, users } from "../config/schema";
import { BCRYPT_SALT_ROUNDS } from "../consts";
import type { NewTask, Team, User } from "../types";

const USER_COUNT = 10;
const SEED_PASSWORD = "123";
const SEED_EMAIL_DOMAIN = "@seed.local";
const TEAM_ASSIGNMENT_PROBABILITY = 0.8;
const MIN_TASKS_PER_OWNER = 4;
const MAX_TASKS_PER_OWNER = 8;

// Real accounts that should also receive personal tasks. Their password,
// role, and current teamId are NEVER modified — we only attach tasks.
const EXISTING_USER_EMAILS = [
  "cassius2828@gmail.com",
  "cassius.reynolds.dev@gmail.com",
  "kdottt28@gmail.com",
];

const TEAM_DEFINITIONS = [
  { name: "Engineering", description: "Builds and maintains the product." },
  { name: "Design", description: "Owns visual and interaction design." },
  { name: "Operations", description: "Keeps the business running smoothly." },
];

const TASK_TITLES = [
  "Review pull request",
  "Update project documentation",
  "Fix flaky test",
  "Investigate production incident",
  "Plan next sprint",
  "Refactor legacy module",
  "Write unit tests",
  "Schedule 1:1 with manager",
  "Migrate database schema",
  "Polish onboarding flow",
  "Audit dependencies",
  "Draft quarterly report",
];

const TASK_DESCRIPTIONS = [
  "Capture findings and follow up with the team.",
  "Block out focus time on the calendar to make progress.",
  "Coordinate with stakeholders before kicking off.",
  "Document the outcome in the shared workspace.",
  "Pair with a teammate to unblock review.",
  "Verify changes locally before merging.",
];

const PRIORITIES = ["none", "low", "medium", "high"] as const;
const CATEGORIES = ["work", "personal", "other"] as const;
const STATUSES = ["pending", "in_progress", "completed"] as const;

const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]!;

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDueDate = () => {
  const offsetDays = randomInt(-14, 14);
  return new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
};

const buildTask = (
  userId: number,
  teamId: number | null,
): Omit<NewTask, "id"> => ({
  userId,
  teamId,
  title: pick(TASK_TITLES),
  description: pick(TASK_DESCRIPTIONS),
  dueDate: randomDueDate(),
  priority: pick(PRIORITIES),
  category: pick(CATEGORIES),
  status: pick(STATUSES),
});

const upsertUsers = async (
  hashedPassword: string,
): Promise<{ allUsers: User[]; createdCount: number }> => {
  const emails = Array.from(
    { length: USER_COUNT },
    (_, i) => `user${i + 1}${SEED_EMAIL_DOMAIN}`,
  );

  const existing = await db
    .select()
    .from(users)
    .where(inArray(users.email, emails));
  const existingByEmail = new Map(existing.map((u) => [u.email, u]));

  const toInsert = emails
    .filter((email) => !existingByEmail.has(email))
    .map((email) => ({ email, password: hashedPassword }));

  let inserted: User[] = [];
  if (toInsert.length > 0) {
    inserted = await db.insert(users).values(toInsert).returning();
  }

  const allUsers = [...existing, ...inserted].sort((a, b) =>
    a.email.localeCompare(b.email, undefined, { numeric: true }),
  );
  return { allUsers, createdCount: inserted.length };
};

const findExistingUsers = async (): Promise<{
  found: User[];
  missing: string[];
}> => {
  if (EXISTING_USER_EMAILS.length === 0) return { found: [], missing: [] };
  const rows = await db
    .select()
    .from(users)
    .where(inArray(users.email, EXISTING_USER_EMAILS));
  const foundEmails = new Set(rows.map((r) => r.email));
  const missing = EXISTING_USER_EMAILS.filter((e) => !foundEmails.has(e));
  return { found: rows, missing };
};

const upsertTeams = async (): Promise<{
  allTeams: Team[];
  createdCount: number;
}> => {
  const names = TEAM_DEFINITIONS.map((t) => t.name);
  const existing = await db
    .select()
    .from(teams)
    .where(inArray(teams.name, names));
  const existingByName = new Map(existing.map((t) => [t.name, t]));

  const toInsert = TEAM_DEFINITIONS.filter((t) => !existingByName.has(t.name));

  let inserted: Team[] = [];
  if (toInsert.length > 0) {
    inserted = await db.insert(teams).values(toInsert).returning();
  }
  return {
    allTeams: [...existing, ...inserted],
    createdCount: inserted.length,
  };
};

const assignUsersToTeams = async (
  allUsers: User[],
  allTeams: Team[],
): Promise<Map<number, User[]>> => {
  const membership = new Map<number, User[]>();
  for (const team of allTeams) membership.set(team.id, []);

  for (const user of allUsers) {
    const teamId =
      Math.random() < TEAM_ASSIGNMENT_PROBABILITY
        ? pick(allTeams).id
        : null;

    await db.update(users).set({ teamId }).where(eq(users.id, user.id));

    if (teamId !== null) {
      membership.get(teamId)!.push({ ...user, teamId });
    }
  }
  return membership;
};

const insertPersonalTasks = async (allUsers: User[]): Promise<number> => {
  const rows: Omit<NewTask, "id">[] = [];
  for (const user of allUsers) {
    const count = randomInt(MIN_TASKS_PER_OWNER, MAX_TASKS_PER_OWNER);
    for (let i = 0; i < count; i++) rows.push(buildTask(user.id, null));
  }
  if (rows.length === 0) return 0;
  await db.insert(tasks).values(rows);
  return rows.length;
};

const insertTeamTasks = async (
  membership: Map<number, User[]>,
): Promise<number> => {
  const rows: Omit<NewTask, "id">[] = [];
  for (const [teamId, members] of membership.entries()) {
    if (members.length === 0) continue;
    const count = randomInt(MIN_TASKS_PER_OWNER, MAX_TASKS_PER_OWNER);
    for (let i = 0; i < count; i++) {
      const owner = pick(members);
      rows.push(buildTask(owner.id, teamId));
    }
  }
  if (rows.length === 0) return 0;
  await db.insert(tasks).values(rows);
  return rows.length;
};

const main = async () => {
  console.log("Seeding database (append mode — re-runs add new task rows)...");

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, BCRYPT_SALT_ROUNDS);

  const { allUsers, createdCount: usersCreated } =
    await upsertUsers(hashedPassword);
  console.log(
    `Users: ${usersCreated} created, ${allUsers.length - usersCreated} reused (total ${allUsers.length}).`,
  );

  const { allTeams, createdCount: teamsCreated } = await upsertTeams();
  console.log(
    `Teams: ${teamsCreated} created, ${allTeams.length - teamsCreated} reused (total ${allTeams.length}).`,
  );

  const membership = await assignUsersToTeams(allUsers, allTeams);
  const assignedCount = [...membership.values()].reduce(
    (sum, m) => sum + m.length,
    0,
  );
  console.log(
    `Team assignments: ${assignedCount}/${allUsers.length} users placed on a team; ${allUsers.length - assignedCount} left unassigned.`,
  );

  const { found: existingUsers, missing: missingExisting } =
    await findExistingUsers();
  if (missingExisting.length > 0) {
    console.warn(
      `Existing users not found (skipped): ${missingExisting.join(", ")}.`,
    );
  }
  const seededTeamIds = new Set(allTeams.map((t) => t.id));
  for (const user of existingUsers) {
    if (user.teamId !== null && seededTeamIds.has(user.teamId)) {
      membership.get(user.teamId)!.push(user);
    }
  }
  console.log(
    `Existing users: ${existingUsers.length} found (teamId preserved).`,
  );

  const seedPersonalCount = await insertPersonalTasks(allUsers);
  const existingPersonalCount = await insertPersonalTasks(existingUsers);
  console.log(
    `Personal tasks inserted: ${seedPersonalCount} for fake users + ${existingPersonalCount} for existing users = ${seedPersonalCount + existingPersonalCount}.`,
  );

  const teamTaskCount = await insertTeamTasks(membership);
  console.log(`Team tasks inserted: ${teamTaskCount}.`);

  console.log("Seed complete.");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
