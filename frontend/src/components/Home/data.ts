import type { MockVariant } from "./Mock";

export type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  variant: MockVariant;
};

export const features: Feature[] = [
  {
    eyebrow: "Tasks",
    title: "Plan, prioritize, and ship",
    body:
      "Create tasks, assign priorities, and filter your backlog. Search by title or owner and group work by team or person so nothing slips.",
    bullets: ["Priority enums", "Search & filters", "Per-team views"],
    variant: "tasks",
  },
  {
    eyebrow: "Teams",
    title: "Bring your group along",
    body:
      "Spin up a team, invite teammates, and review join requests in one place. Roles keep admin actions safely in the right hands.",
    bullets: ["Invites", "Join requests", "Role-based access"],
    variant: "team",
  },
  {
    eyebrow: "Profile",
    title: "Your activity, at a glance",
    body:
      "See what you have on your plate, your recent activity, and the teams you belong to from a single profile shell.",
    bullets: ["Personal task list", "Team memberships", "Account details"],
    variant: "profile",
  },
];

export type Step = {
  n: string;
  title: string;
  body: string;
};

export const steps: Step[] = [
  {
    n: "01",
    title: "Sign in",
    body: "Use your account to get a session and unlock the full app.",
  },
  {
    n: "02",
    title: "Pick a team",
    body: "Join an existing team or create your own and invite teammates.",
  },
  {
    n: "03",
    title: "Track your work",
    body: "Capture tasks, set priorities, and keep momentum together.",
  },
];

export const heroStats = [
  { k: "Stack", v: "Express · Drizzle" },
  { k: "Frontend", v: "React · Tailwind" },
  { k: "Auth", v: "Sessions · Roles" },
];

export const liveActivityBullets = [
  "Per-user and per-team views",
  "Quick filters for priority and status",
  "Wired to your Express + Drizzle endpoints",
];

/** Centered marketing-section wrapper. Tighter than `PageShell` (no padding-y). */
export const sectionWrapClass = "mx-auto w-full max-w-6xl px-6 sm:px-10";
