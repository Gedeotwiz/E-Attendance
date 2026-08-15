export interface DailyReport {
  date: string;
  present: number;
  absent: number;
  totalStudents: number;
}

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