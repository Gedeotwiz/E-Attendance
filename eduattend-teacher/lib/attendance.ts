import { apiFetch } from "./api";

import { GetSessionAttendanceResponse,CreateSessionRequest,CreateSessionResponse,GetCurrentSessionResponse,CloseAttendanceSessionResponse } from "@/types/attendance";

export async function getSessionAttendance(
  sessionId: string
): Promise<GetSessionAttendanceResponse> {
  return apiFetch<GetSessionAttendanceResponse>(
    `/api/attendance/session/${sessionId}`
  );
}


export async function createAttendanceSession(
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  return apiFetch<CreateSessionResponse>(
    "/api/attendance/create-session",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}


export async function getCurrentSession(): Promise<GetCurrentSessionResponse> {
  return apiFetch<GetCurrentSessionResponse>(
    "/api/attendance/current-session"
  );
}

export async function closeAttendanceSession(
  sessionId: string
): Promise<CloseAttendanceSessionResponse> {
  return apiFetch<CloseAttendanceSessionResponse>(
    `/api/attendance/close-session/${sessionId}`,
    {
      method: "PATCH",
    }
  );
}