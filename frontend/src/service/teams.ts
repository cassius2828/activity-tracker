import { api } from "./api";

export type TeamRole = "admin" | "user";

export type TeamUser = {
  id: string;
  email: string;
  role: TeamRole;
  teamId: string | null;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
};

type JoinRequest = {
  id: string;
  teamId: string;
  userId: string;
  status: "pending";
  createdAt: string;
};

export type ServiceResult<T> = {
  data: T;
  source: "api" | "local";
  fallbackReason?: string;
};

const TEAMS_KEY = "activity-tracker.mock.teams.v1";
const USERS_KEY = "activity-tracker.mock.users.v1";
const JOIN_REQUESTS_KEY = "activity-tracker.mock.join-requests.v1";

const seedUsers: TeamUser[] = [
  { id: "1", email: "admin@activity.dev", role: "admin", teamId: "team-1" },
  { id: "2", email: "alex@activity.dev", role: "user", teamId: "team-1" },
  { id: "3", email: "sam@activity.dev", role: "user", teamId: "team-2" },
  { id: "4", email: "jordan@activity.dev", role: "user", teamId: null },
];

const nowIso = () => new Date().toISOString();

const seedTeams: Team[] = [
  {
    id: "team-1",
    name: "Product",
    description: "Core planning and execution",
    memberIds: ["1", "2"],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "team-2",
    name: "Design",
    description: "User experience and UI polish",
    memberIds: ["3"],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const canUseStorage = () => typeof window !== "undefined";

const readStorage = <T,>(key: string): T | null => {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const ensureLocalState = () => {
  let teams = readStorage<Team[]>(TEAMS_KEY);
  let users = readStorage<TeamUser[]>(USERS_KEY);
  let joinRequests = readStorage<JoinRequest[]>(JOIN_REQUESTS_KEY);

  if (!teams) {
    teams = seedTeams;
    writeStorage(TEAMS_KEY, teams);
  }
  if (!users) {
    users = seedUsers;
    writeStorage(USERS_KEY, users);
  }
  if (!joinRequests) {
    joinRequests = [];
    writeStorage(JOIN_REQUESTS_KEY, joinRequests);
  }

  return { teams, users, joinRequests };
};

const saveLocalState = ({
  teams,
  users,
  joinRequests,
}: {
  teams: Team[];
  users: TeamUser[];
  joinRequests: JoinRequest[];
}) => {
  writeStorage(TEAMS_KEY, teams);
  writeStorage(USERS_KEY, users);
  writeStorage(JOIN_REQUESTS_KEY, joinRequests);
};

const runWithFallback = async <T,>(
  apiCall: () => Promise<T>,
  fallbackCall: () => Promise<T> | T,
): Promise<ServiceResult<T>> => {
  try {
    const data = await apiCall();
    return { data, source: "api" };
  } catch (err) {
    const data = await fallbackCall();
    const fallbackReason =
      err instanceof Error ? err.message : "Request failed, using local fallback";
    return { data, source: "local", fallbackReason };
  }
};

const ensureUserExists = (users: TeamUser[], user: Pick<TeamUser, "id" | "email" | "role">) => {
  const existing = users.find((candidate) => candidate.id === user.id);
  if (existing) return users;
  return [...users, { ...user, teamId: null }];
};

const updateUserTeam = ({
  users,
  userId,
  teamId,
}: {
  users: TeamUser[];
  userId: string;
  teamId: string | null;
}) =>
  users.map((user) => {
    if (user.id !== userId) return user;
    return { ...user, teamId };
  });

export const getTeams = async () =>
  runWithFallback(
    async () => {
      const response = await api.get<Team[]>("/teams");
      return response.data;
    },
    () => ensureLocalState().teams,
  );

export const getTeamById = async (teamId: string) =>
  runWithFallback(
    async () => {
      const response = await api.get<Team>(`/teams/${teamId}`);
      return response.data;
    },
    () => ensureLocalState().teams.find((team) => team.id === teamId) ?? null,
  );

export const createTeam = async ({
  name,
  description,
  creator,
}: {
  name: string;
  description: string;
  creator: Pick<TeamUser, "id" | "email" | "role">;
}) =>
  runWithFallback(
    async () => {
      const response = await api.post<Team>("/teams", { name, description });
      return response.data;
    },
    () => {
      const state = ensureLocalState();
      const usersWithCreator = ensureUserExists(state.users, creator);
      const nextTeam: Team = {
        id: `team-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        memberIds: [creator.id],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      const nextTeams = [nextTeam, ...state.teams];
      const nextUsers = updateUserTeam({
        users: usersWithCreator,
        userId: creator.id,
        teamId: nextTeam.id,
      });
      saveLocalState({
        teams: nextTeams,
        users: nextUsers,
        joinRequests: state.joinRequests,
      });
      return nextTeam;
    },
  );

export const chooseTeam = async ({
  teamId,
  user,
}: {
  teamId: string;
  user: Pick<TeamUser, "id" | "email" | "role">;
}) =>
  runWithFallback(
    async () => {
      const response = await api.post<TeamUser>(`/teams/${teamId}/choose`, {
        userId: user.id,
      });
      return response.data;
    },
    () => {
      const state = ensureLocalState();
      const usersWithCurrent = ensureUserExists(state.users, user);
      const nextUsers = updateUserTeam({
        users: usersWithCurrent,
        userId: user.id,
        teamId,
      });
      const nextTeams = state.teams.map((team) => {
        const withoutUser = team.memberIds.filter((id) => id !== user.id);
        if (team.id === teamId) {
          return {
            ...team,
            memberIds: [...withoutUser, user.id],
            updatedAt: nowIso(),
          };
        }
        return { ...team, memberIds: withoutUser };
      });
      const selectedUser = nextUsers.find((candidate) => candidate.id === user.id);
      saveLocalState({
        teams: nextTeams,
        users: nextUsers,
        joinRequests: state.joinRequests,
      });
      return selectedUser ?? { ...user, teamId };
    },
  );

export const leaveTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) =>
  runWithFallback(
    async () => {
      const response = await api.post<{ message: string }>(`/teams/${teamId}/leave`, {
        userId,
      });
      return response.data;
    },
    () => {
      const state = ensureLocalState();
      const nextTeams = state.teams.map((team) => {
        if (team.id !== teamId) return team;
        return {
          ...team,
          memberIds: team.memberIds.filter((id) => id !== userId),
          updatedAt: nowIso(),
        };
      });
      const nextUsers = updateUserTeam({ users: state.users, userId, teamId: null });
      saveLocalState({
        teams: nextTeams,
        users: nextUsers,
        joinRequests: state.joinRequests,
      });
      return { message: "Left team successfully" };
    },
  );

export const requestJoinTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) =>
  runWithFallback(
    async () => {
      const response = await api.post<{ message: string }>(
        `/teams/${teamId}/join-requests`,
        {
          userId,
        },
      );
      return response.data;
    },
    () => {
      const state = ensureLocalState();
      const alreadyExists = state.joinRequests.some(
        (request) => request.teamId === teamId && request.userId === userId,
      );
      if (!alreadyExists) {
        const nextJoinRequests = [
          ...state.joinRequests,
          {
            id: `request-${Date.now()}`,
            teamId,
            userId,
            status: "pending" as const,
            createdAt: nowIso(),
          },
        ];
        saveLocalState({
          teams: state.teams,
          users: state.users,
          joinRequests: nextJoinRequests,
        });
      }
      return { message: "Join request submitted" };
    },
  );

export const searchUsers = async (query: string) =>
  runWithFallback(
    async () => {
      const response = await api.get<TeamUser[]>("/users", {
        params: { q: query },
      });
      return response.data;
    },
    () => {
      const normalizedQuery = query.trim().toLowerCase();
      const users = ensureLocalState().users;
      if (!normalizedQuery) return users.slice(0, 10);
      return users.filter((user) => user.email.toLowerCase().includes(normalizedQuery));
    },
  );

export const assignUserToTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) =>
  runWithFallback(
    async () => {
      const response = await api.post<TeamUser>(`/teams/${teamId}/members`, { userId });
      return response.data;
    },
    () => {
      const state = ensureLocalState();
      const nextUsers = updateUserTeam({
        users: state.users,
        userId,
        teamId,
      });
      const nextTeams = state.teams.map((team) => {
        const withoutUser = team.memberIds.filter((id) => id !== userId);
        if (team.id === teamId) {
          return {
            ...team,
            memberIds: [...withoutUser, userId],
            updatedAt: nowIso(),
          };
        }
        return { ...team, memberIds: withoutUser };
      });

      saveLocalState({
        teams: nextTeams,
        users: nextUsers,
        joinRequests: state.joinRequests,
      });

      const updatedUser = nextUsers.find((candidate) => candidate.id === userId);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    },
  );

export const getUserById = async (userId: string) =>
  runWithFallback(
    async () => {
      const response = await api.get<TeamUser>(`/users/${userId}`);
      return response.data;
    },
    () => ensureLocalState().users.find((user) => user.id === userId) ?? null,
  );
