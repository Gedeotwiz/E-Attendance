import { apiFetch } from "@/lib/api";
import { AttendanceReportResponse, ReportPeriod } from "@/types/report";

export async function getAttendanceReport(period: ReportPeriod, date?: string): Promise<AttendanceReportResponse> {
  const params = new URLSearchParams({ period });
  if (date) params.append("date", date); // gusa
  return apiFetch<AttendanceReportResponse>(`/api/reports?${params.toString()}`);
}

export function exportAttendanceReport(period: ReportPeriod, date: string, format: "pdf" | "xlsx" | "csv") {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, ""); // ikuraho /
  const params = new URLSearchParams({ period, date, format });
  window.open(`${baseUrl}/api/reports/export?${params.toString()}`, "_blank");
}