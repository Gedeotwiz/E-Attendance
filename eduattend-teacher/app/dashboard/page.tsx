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

import { getSessionAttendance } from "@/lib/attendance";
import {
  AttendanceRecord,
  GetSessionAttendanceResponse,
} from "@/types/attendance";

// Current attendance session
const SESSION_ID = "f3597463aca32100cb43c0edb4e44a4e";

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

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * Fetch attendance from API
   */
  const fetchAttendance = async () => {
    try {
      setError(null);

      const response =
        await getSessionAttendance(SESSION_ID);

      setData(response);
    } catch (err) {
      console.error(
        "Failed to fetch attendance:",
        err
      );

      setError(
        "Failed to load attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial fetch + auto refresh
   */
  useEffect(() => {
    fetchAttendance();

    const interval = setInterval(() => {
      fetchAttendance();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * Current date
   */
  const today = new Date();

  /**
   * Loading state
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
   * Error state
   */
  if (error) {
    return (
      <DashboardLayout>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-700">
            Unable to load attendance
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchAttendance}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>

        </div>

      </DashboardLayout>
    );
  }

  /**
   * No attendance data
   */
  if (!data) {
    return (
      <DashboardLayout>

        <div className="rounded-xl border bg-white p-8 text-center">

          <p className="text-sm text-slate-500">
            No attendance data available.
          </p>

        </div>

      </DashboardLayout>
    );
  }

  /**
   * API data
   */
  const {
    session,
    summary,
    attendance,
  } = data;

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

          {today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}

        </div>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Students */}

        <StatCard
          title="Total Students"
          value={String(summary.totalStudents)}
          description="All registered"
          icon={Users}
          variant="blue"
        />

        {/* Present */}

        <StatCard
          title="Present Today"
          value={String(summary.totalPresent)}
          description={`${summary.attendanceRate}% of total`}
          icon={UserCheck}
          variant="green"
        />

        {/* Absent */}

        <StatCard
          title="Absent Today"
          value={String(summary.totalAbsent)}
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
                {session.className} · {session.subject}
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