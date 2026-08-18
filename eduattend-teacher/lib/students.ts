import { apiFetch } from "./api";
import { Student } from "@/types/student";

export interface GetStudentsResponse {
  students: Student[];
  total?: number;
}

export async function getStudents(): Promise<GetStudentsResponse> {
  return apiFetch<GetStudentsResponse>("/api/students");
}