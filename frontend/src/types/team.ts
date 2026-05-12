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

export type TeamForm = {
  name: string;
  description: string;
};
