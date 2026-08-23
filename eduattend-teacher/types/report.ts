// ======================================================
// REPORT TYPES
// ======================================================

export type ReportPeriod =
  | "daily"
  | "weekly"
  | "monthly";


// ======================================================
// DAILY REPORT
// ======================================================

export interface DailyReport {
  date: string;
  present: number;
  absent: number;
  totalStudents: number;
}


// ======================================================
// MONTHLY REPORT
// ======================================================

export interface MonthlyReport {
  period: {
    year: number;
    month: number;
  };

  summary: {
    totalStudents: number;
    totalSessions: number;
    totalPresent: number;
    totalAbsent: number;
    attendanceRate: number;
  };

  daily: DailyReport[];
}


// ======================================================
// REPORT TABLE ROW
// ======================================================

export interface AttendanceReportRow {
  date: string;
  sessions: number;
  present: number;
  absent: number;
  rate: number;
}


// ======================================================
// CHART
// ======================================================

export interface AttendanceReportChart {
  name: string;
  value: number;
}


// ======================================================
// TOP STUDENT
// ======================================================

export interface TopStudent {
  rank: number;
  name: string;
  studentCode: string;
  present: number;
  totalSessions: number;
  rate: number;
}


// ======================================================
// SUMMARY
// ======================================================

export interface AttendanceReportSummary {
  totalStudents: number;
  totalSessions: number;
  totalPresent: number;
  totalAbsent: number;
  attendanceRate: number;
}


// ======================================================
// COMPLETE REPORT RESPONSE
// ======================================================

export interface AttendanceReportResponse {
  period: ReportPeriod;

  startDate: string;

  endDate: string;

  summary: AttendanceReportSummary;

  chart: AttendanceReportChart[];

  topStudents: TopStudent[];

  rows: AttendanceReportRow[];
}