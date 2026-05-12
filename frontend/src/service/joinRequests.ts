import { api } from "./api";

export type JoinRequestRow = {
  id: number;
  teamId: number;
  teamName: string;
  userId: number;
  userEmail: string;
};

export type MyJoinRequestRow = {
  id: number;
  teamId: number;
  teamName: string;
};

export const getJoinRequests = async () => {
  const response = await api.get<JoinRequestRow[]>("/join-requests");
  return response.data;
};

export const getMyJoinRequests = async () => {
  const response = await api.get<MyJoinRequestRow[]>("/join-requests/me");
  return response.data;
};

export const requestJoinTeam = async ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) => {
  const response = await api.post<{ message: string }>("/join-requests", {
    teamId,
    userId,
  });
  return response.data;
};

export const approveJoinRequest = async (joinRequestId: number) => {
  const response = await api.put<{ message: string }>(
    `/join-requests/${joinRequestId}/approve`,
  );
  return response.data;
};

export const denyJoinRequest = async (joinRequestId: number) => {
  const response = await api.delete<{ message: string }>(
    `/join-requests/${joinRequestId}`,
  );
  return response.data;
};
