"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Percent,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

import {
  getCurrentSession,
  getSessionAttendance,
} from "@/lib/attendance";

import {
  AttendanceRecord,
  GetSessionAttendanceResponse,
  GetCurrentSessionResponse,
} from "@/types/attendance";

/**
 * Format attendance scan time
 */
const formatTime = (date: string | null) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Attendance table columns
 */
const columns = [
  {
    key: "number",
    header: "#",

    render: (
      _: AttendanceRecord,
      index: number
    ) => index + 1,
  },

  {
    key: "name",
    header: "Student Name",

    render: (item: AttendanceRecord) =>
      item.student.name,
  },

  {
    key: "code",
    header: "Student Code",

    render: (item: AttendanceRecord) =>
      item.student.studentCode,
  },

  {
    key: "className",
    header: "Class",

    render: (item: AttendanceRecord) =>
      item.student.className,
  },

  {
    key: "status",
    header: "Status",

    render: (item: AttendanceRecord) => (
      <StatusBadge status={item.status} />
    ),
  },

  {
    key: "time",
    header: "Time",

    render: (item: AttendanceRecord) =>
      formatTime(item.scannedAt),
  },
];

export default function DashboardPage() {
  const [data, setData] =
    useState<GetSessionAttendanceResponse | null>(
      null
    );

  const [currentSession, setCurrentSession] =
    useState<GetCurrentSessionResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * =====================================================
   * FETCH CURRENT SESSION + ATTENDANCE
   * =====================================================
   */
  const fetchAttendance = async () => {
    try {
      setError(null);

      /*
       * First get the current active session
       */
      const sessionResponse =
        await getCurrentSession();

      setCurrentSession(
        sessionResponse
      );

      /*
       * Get the current session ID
       */
      const sessionId =
        sessionResponse.session.sessionId;

      console.log(
        "Current session ID:",
        sessionId
      );

      /*
       * Now get attendance using the
       * current session ID
       */
      const attendanceResponse =
        await getSessionAttendance(
          sessionId
        );

      setData(
        attendanceResponse
      );

    } catch (err) {
      console.error(
        "Failed to fetch attendance:",
        err
      );

      /*
       * If there is no active session,
       * show a friendly message.
       */
      if (err instanceof Error) {
        setError(
          err.message ||
            "No active attendance session."
        );
      } else {
        setError(
          "Failed to load attendance. Please try again."
        );
      }

      setCurrentSession(null);
      setData(null);

    } finally {
      setLoading(false);
    }
  };

  /**
   * =====================================================
   * INITIAL FETCH + AUTO REFRESH
   * =====================================================
   */
  useEffect(() => {
    fetchAttendance();

    /*
     * Refresh every 5 seconds
     *
     * This means:
     *
     * New session created
     *       ↓
     * Dashboard finds it
     *
     * New student scans QR
     *       ↓
     * Dashboard updates
     *
     * Session closed
     *       ↓
     * Dashboard detects it
     */
    const interval = setInterval(() => {
      fetchAttendance();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * =====================================================
   * CURRENT DATE
   * =====================================================
   */
  const today = new Date();

  /**
   * =====================================================
   * LOADING STATE
   * =====================================================
   */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading dashboard...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  /**
   * =====================================================
   * NO ACTIVE SESSION
   * =====================================================
   */
  if (!currentSession || !data) {
    return (
      <DashboardLayout>

        {/* HEADER */}

        <div className="mb-7 flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Welcome back, John Teacher 👋
            </p>

          </div>

          <div className="rounded-lg bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">

            {today.toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}

          </div>

        </div>

        {/* NO SESSION */}

        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Users
              size={25}
              className="text-slate-400"
            />
          </div>

          <h2 className="mt-4 text-base font-semibold text-slate-800">
            No Active Attendance Session
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            There is currently no active attendance
            session. Create a new session to start
            recording attendance.
          </p>

          <Button className="mt-5">

            <a
              href="/generate-qr"
              className="block w-full"
            >
              Generate QR Code
            </a>

          </Button>

          {error && (
            <p className="mt-4 text-xs text-red-500">
              {error}
            </p>
          )}

        </div>

      </DashboardLayout>
    );
  }

  /**
   * =====================================================
   * API DATA
   * =====================================================
   */
  const {
    session,
    summary,
    attendance,
  } = data;

  /**
   * =====================================================
   * RENDER DASHBOARD
   * =====================================================
   */
  return (
    <DashboardLayout>

      {/* ================= HEADER ================= */}

      <div className="mb-7 flex items-center justify-between">

        <div>

          <h1 className="text-xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, John Teacher 👋
          </p>

        </div>

        <div className="rounded-lg bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">

          {today.toLocaleDateString(
            "en-US",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}

        </div>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Students */}

        <StatCard
          title="Total Students"
          value={String(
            summary.totalStudents
          )}
          description="All registered"
          icon={Users}
          variant="blue"
        />

        {/* Present */}

        <StatCard
          title="Present Today"
          value={String(
            summary.totalPresent
          )}
          description={`${summary.attendanceRate}% of total`}
          icon={UserCheck}
          variant="green"
        />

        {/* Absent */}

        <StatCard
          title="Absent Today"
          value={String(
            summary.totalAbsent
          )}
          description={`${100 - summary.attendanceRate}% of total`}
          icon={UserX}
          variant="red"
        />

        {/* Attendance Rate */}

        <StatCard
          title="Attendance Rate"
          value={`${summary.attendanceRate}%`}
          description="Today's rate"
          icon={Percent}
          variant="purple"
        />

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">

        {/* ================= ATTENDANCE TABLE ================= */}

        <div>

          <div className="mb-3 flex items-center justify-between">

            <div>

              <h2 className="text-sm font-bold text-slate-800">
                Today's Attendance
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {session.className} ·{" "}
                {session.subject}
              </p>

            </div>

            <StatusBadge
              status={
                session.status === "ACTIVE"
                  ? "Active"
                  : "Inactive"
              }
            />

          </div>

          <DataTable
            columns={columns}
            data={attendance}
          />

        </div>

        {/* ================= RIGHT SIDEBAR ================= */}

        <div className="space-y-5">

          {/* Quick Actions */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <h2 className="text-sm font-bold text-slate-800">
              Quick Actions
            </h2>

            <div className="mt-4 space-y-3">

              <Button className="w-full">

                <a
                  href="/generate-qr"
                  className="block w-full"
                >
                  Generate QR Code
                </a>

              </Button>

              <Button
                variant="secondary"
                className="w-full"
              >

                <a
                  href="/reports"
                  className="block w-full"
                >
                  View Reports
                </a>

              </Button>

            </div>

          </div>

          {/* Attendance This Week */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <h2 className="text-sm font-bold text-slate-800">
              Attendance This Week
            </h2>

            <div className="mt-6 flex h-32 items-end justify-between gap-2">

              {[70, 85, 60, 90, 75, 95, 80].map(
                (height, index) => (

                  <div
                    key={index}
                    className="flex flex-1 items-end"
                  >

                    <div
                      className="w-full rounded-t bg-blue-500"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                  </div>

                )
              )}

            </div>

            <div className="mt-2 flex justify-between text-[10px] text-slate-400">

              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}