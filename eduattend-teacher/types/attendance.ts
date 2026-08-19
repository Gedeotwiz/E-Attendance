
export interface SessionStudent {
  id: string;
  name: string;
  studentCode: string;
  className: string;
}

export interface AttendanceRecord {
  id: string;
  student: SessionStudent;
  status: "Present" | "Absent";
  scannedAt: string | null;
}



export interface AttendanceSession {
  id: string;
  sessionId: string;
  className: string;
  subject: string;
  description?: string;
  createdAt: string;
  expiresAt: string;
  status: "ACTIVE" | "CLOSED" | "EXPIRED";
}

export interface AttendanceSummary {
  totalStudents: number;
  totalPresent: number;
  totalAbsent: number;
  attendanceRate: number;
}

export interface GetSessionAttendanceResponse {
  message: string;
  session: AttendanceSession;
  summary: AttendanceSummary;
  attendance: AttendanceRecord[];
}


export interface CreateSessionRequest {
  className: string;
  subject: string;
  description?: string;
}

export interface CreateSessionResponse {
  message: string;

  session: {
    id: string;
    sessionId: string;
    className: string;
    subject: string;
    createdAt: string;
    expiresAt: string;
    status: string;
  };

  studentAppUrl: string;
}



export interface GetCurrentSessionResponse {
  message: string;
  session: AttendanceSession;
  studentAppUrl: string;
}

export interface CloseAttendanceSessionResponse {
  message: string;
  session: {
    id: string;
    sessionId: string;
    status: "CLOSED";
    expiresAt: string;
  };
}