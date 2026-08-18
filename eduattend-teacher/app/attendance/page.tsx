"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  getSessionAttendance,
} from "@/lib/attendance";
import { AttendanceRecord,GetSessionAttendanceResponse } from "@/types/attendance";

// Current attendance session
const SESSION_ID = "f3597463aca32100cb43c0edb4e44a4e";

export default function AttendancePage() {
  const [data, setData] =
    useState<GetSessionAttendanceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      setError(null);

      const response =
        await getSessionAttendance(SESSION_ID);

      setData(response);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);

      setError(
        "Failed to load attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + auto refresh
  useEffect(() => {
    fetchAttendance();

    const interval = setInterval(() => {
      fetchAttendance();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

            <p className="text-sm text-slate-500">
              Loading attendance...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Attendance"
          description="Monitor the current attendance session"
        />

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchAttendance}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // No data
  if (!data) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Attendance"
          description="Monitor the current attendance session"
        />

        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-sm text-slate-500">
            No attendance data found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const {
    session,
    summary,
    attendance,
  } = data;

  // Format time
  const formatTime = (
    date: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      [],
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Table columns
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

  return (
    <DashboardLayout>

      <PageHeader
        title="Attendance"
        description="Monitor the current attendance session"
        action={
          <div className="flex gap-2">

            <Button variant="secondary">
              <a href="/generate-qr">
                View QR Code
              </a>
            </Button>

            <Button variant="danger">
              Close Session
            </Button>

          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Status */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Session Status
          </p>

          <div className="mt-3">
            <StatusBadge
              status={
                session.status === "ACTIVE"
                  ? "Active"
                  : "Inactive"
              }
            />
          </div>

        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Session ID
          </p>

          <p
            className="mt-3 truncate text-sm font-semibold text-slate-800"
            title={session.sessionId}
          >
            {session.sessionId}
          </p>

        </div>


        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Present
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {summary.totalPresent}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Total Students
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {summary.totalStudents}
          </p>

        </div>

      </div>

      <div className="mb-3 flex items-center justify-between">

        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Today's Attendance
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Attendance updates automatically when students scan the QR code.
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
          {attendance.length} records
        </div>

      </div>

      <DataTable
        columns={columns}
        data={attendance}
      />

    </DashboardLayout>
  );
}