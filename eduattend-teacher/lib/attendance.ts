import { apiFetch } from "./api";

import { GetSessionAttendanceResponse,CreateSessionRequest,CreateSessionResponse } from "@/types/attendance";

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