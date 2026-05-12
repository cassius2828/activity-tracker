import { api } from "./api";
import type { Team, TeamRole, TeamUser } from "../types/team";

export type { Team, TeamRole, TeamUser };

export const getTeams = async () => {
  const response = await api.get<Team[]>("/teams");
  return response.data;
};

export const getTeamById = async (teamId: string) => {
  const response = await api.get<Team | Team[]>(`/teams/${teamId}`);
  const payload = response.data;
  return Array.isArray(payload) ? (payload[0] ?? null) : payload;
};

export const createTeam = async ({
  name,
  description,
  creators,
}: {
  name: string;
  description: string;
  creators: Pick<TeamUser, "id" | "role">[];
}) => {
  const response = await api.post<Team>("/teams", {
    name,
    description,
    creators
  });
  return response.data;
};

export const leaveTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) => {
  const response = await api.put<{ message: string }>(
    `/teams/${teamId}/leave`,
    {
      userId,
    },
  );
  return response.data;
};

export const searchUsers = async (query: string) => {
  const response = await api.get<TeamUser[]>("/users", {
    params: { q: query },
  });
  return response.data;
};

export const assignUserToTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) => {
  const response = await api.put<{ message: string }>(`/teams/${teamId}/join`, {
    userId,
  });
  return response.data;
};
