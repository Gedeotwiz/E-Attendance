"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

import {
  getCurrentSession,
  getSessionAttendance,
  closeAttendanceSession,
} from "@/lib/attendance";

import {
  AttendanceRecord,
  GetSessionAttendanceResponse,
  GetCurrentSessionResponse,
} from "@/types/attendance";

export default function AttendancePage() {
  const [data, setData] =
    useState<GetSessionAttendanceResponse | null>(null);

  const [currentSession, setCurrentSession] =
    useState<GetCurrentSessionResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [closing, setClosing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
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

      console.log(
        "Current session:",
        sessionResponse
      );

      setCurrentSession(
        sessionResponse
      );

      /*
       * Get the session ID dynamically
       *
       * No hardcoded SESSION_ID anymore.
       */
      const sessionId =
        sessionResponse.session.sessionId;

      console.log(
        "Current session ID:",
        sessionId
      );

      /*
       * Fetch attendance for current session
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

      setCurrentSession(null);
      setData(null);

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

    } finally {
      setLoading(false);
    }
  };

  /**
   * =====================================================
   * CLOSE SESSION
   * =====================================================
   */
  const handleCloseSession = async () => {
    if (!currentSession) {
      setError(
        "No active attendance session found."
      );

      return;
    }

    const sessionId =
      currentSession.session.sessionId;

    const confirmed =
      window.confirm(
        "Are you sure you want to close this attendance session?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setClosing(true);
      setError(null);
      setSuccess(null);

      await closeAttendanceSession(
        sessionId
      );

      setSuccess(
        "Attendance session closed successfully."
      );

      /*
       * Clear current session and attendance
       */
      setCurrentSession(null);
      setData(null);

    } catch (err) {
      console.error(
        "Failed to close session:",
        err
      );

      if (err instanceof Error) {
        setError(
          err.message ||
            "Failed to close attendance session."
        );
      } else {
        setError(
          "Failed to close attendance session."
        );
      }

    } finally {
      setClosing(false);
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
     */
    const interval =
      setInterval(() => {
        fetchAttendance();
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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

            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

            <p className="text-sm text-slate-500">
              Loading attendance...
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

        <PageHeader
          title="Attendance"
          description="Monitor the current attendance session"
          action={
            <Button variant="secondary">
              <a href="/generate-qr">
                Generate QR Code
              </a>
            </Button>
          }
        />

        {/* Success */}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">

            <p className="text-sm font-medium text-green-700">
              {success}
            </p>

          </div>
        )}

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-5">

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
        )}

        {/* No session */}

        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

            <span className="text-2xl">
              📋
            </span>

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
            <a href="/generate-qr">
              Generate QR Code
            </a>
          </Button>

        </div>

      </DashboardLayout>
    );
  }

  /**
   * =====================================================
   * DATA
   * =====================================================
   */
  const {
    session,
    summary,
    attendance,
  } = data;

  /**
   * =====================================================
   * FORMAT TIME
   * =====================================================
   */
  const formatTime = (
    date: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * =====================================================
   * TABLE COLUMNS
   * =====================================================
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

      render: (
        item: AttendanceRecord
      ) =>
        item.student.name,
    },

    {
      key: "code",
      header: "Student Code",

      render: (
        item: AttendanceRecord
      ) =>
        item.student.studentCode,
    },

    {
      key: "className",
      header: "Class",

      render: (
        item: AttendanceRecord
      ) =>
        item.student.className,
    },

    {
      key: "status",
      header: "Status",

      render: (
        item: AttendanceRecord
      ) => (
        <StatusBadge
          status={item.status}
        />
      ),
    },

    {
      key: "time",
      header: "Time",

      render: (
        item: AttendanceRecord
      ) =>
        formatTime(
          item.scannedAt
        ),
    },
  ];

  /**
   * =====================================================
   * RENDER
   * =====================================================
   */
  return (
    <DashboardLayout>

      {/* ================= HEADER ================= */}

      <PageHeader
        title="Attendance"
        description="Monitor the current attendance session"
        action={
          <div className="flex gap-2">

            <Button
              variant="secondary"
            >
              <a href="/generate-qr">
                View QR Code
              </a>
            </Button>

            <Button
              variant="danger"
              onClick={
                handleCloseSession
              }
              disabled={closing}
            >
              {closing
                ? "Closing..."
                : "Close Session"}
            </Button>

          </div>
        }
      />

      {/* ================= SUCCESS ================= */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-700">
            {success}
          </p>

        </div>
      )}

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}

      {/* ================= STAT CARDS ================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Status */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Session Status
          </p>

          <div className="mt-3">

            <StatusBadge
              status={
                session.status ===
                "ACTIVE"
                  ? "Active"
                  : "Inactive"
              }
            />

          </div>

        </div>

        {/* Session ID */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Session ID
          </p>

          <p
            className="mt-3 truncate text-sm font-semibold text-slate-800"
            title={
              session.sessionId
            }
          >
            {session.sessionId}
          </p>

        </div>

        {/* Present */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Present
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {summary.totalPresent}
          </p>

        </div>

        {/* Total Students */}

        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <p className="text-xs font-medium text-slate-400">
            Total Students
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {summary.totalStudents}
          </p>

        </div>

      </div>

      {/* ================= ATTENDANCE TABLE HEADER ================= */}

      <div className="mb-3 flex items-center justify-between">

        <div>

          <h2 className="text-sm font-bold text-slate-800">
            Today's Attendance
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Attendance updates automatically when
            students scan the QR code.
          </p>

        </div>

        <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
          {attendance.length} records
        </div>

      </div>

      {/* ================= ATTENDANCE TABLE ================= */}

      <DataTable
        columns={columns}
        data={attendance}
      />

    </DashboardLayout>
  );
}