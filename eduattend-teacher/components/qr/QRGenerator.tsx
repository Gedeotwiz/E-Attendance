"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import Button from "@/components/ui/Button";

import {
  createAttendanceSession,
  getCurrentSession,
  closeAttendanceSession,
} from "@/lib/attendance";

interface AttendanceSession {
  id: string;
  sessionId: string;
  className: string;
  subject: string;
  description?: string;
  createdAt: string;
  expiresAt: string;
  status: "ACTIVE" | "CLOSED" | "EXPIRED";
}

interface AttendanceSessionResponse {
  message: string;
  session: AttendanceSession;
  studentAppUrl: string;
}

export default function QRGenerator() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [sessionUrl, setSessionUrl] =
    useState<string | null>(null);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [session, setSession] =
    useState<AttendanceSession | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [loadingSession, setLoadingSession] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /*
   * =====================================================
   * LOAD CURRENT ACTIVE SESSION
   * =====================================================
   *
   * This runs whenever the page is opened/refreshed.
   *
   * The QR is loaded from MongoDB through the backend.
   */

  useEffect(() => {
    loadCurrentSession();
  }, []);

  async function loadCurrentSession() {
    try {
      setLoadingSession(true);
      setError(null);

      const response =
        (await getCurrentSession()) as AttendanceSessionResponse;

      console.log(
        "Current attendance session:",
        response
      );

      setSessionUrl(
        response.studentAppUrl
      );

      setSessionId(
        response.session.sessionId
      );

      setSession(
        response.session
      );

      setClassName(
        response.session.className
      );

      setSubject(
        response.session.subject || ""
      );

      setDescription(
        response.session.description || ""
      );

      setSuccess(
        "Active attendance session loaded."
      );

    } catch (err) {
      /*
       * 404 means there is no active session.
       *
       * This is NOT a real error for our UI.
       */

      console.log(
        "No active attendance session."
      );

      setSessionUrl(null);
      setSessionId(null);
      setSession(null);

    } finally {
      setLoadingSession(false);
    }
  }

  /*
   * =====================================================
   * CREATE ATTENDANCE SESSION
   * =====================================================
   */

  async function generateQR() {
    try {
      setError(null);
      setSuccess(null);

      /*
       * Validate class
       */

      if (!className) {
        setError(
          "Please select a class."
        );

        return;
      }

      /*
       * Validate subject
       */

      if (!subject.trim()) {
        setError(
          "Please enter the subject."
        );

        return;
      }

      /*
       * Prevent creating another session
       * if one is already active.
       */

      if (sessionUrl && session) {
        setError(
          "There is already an active attendance session. Please close it before creating another one."
        );

        return;
      }

      setLoading(true);

      /*
       * Create attendance session
       */

      const response =
        (await createAttendanceSession({
          className,
          subject,
          description,
        })) as AttendanceSessionResponse;

      console.log(
        "Attendance session:",
        response
      );

      /*
       * Save session information
       */

      setSession(
        response.session
      );

      setSessionId(
        response.session.sessionId
      );

      setSessionUrl(
        response.studentAppUrl
      );

      setSuccess(
        "Attendance session created successfully."
      );

    } catch (err) {
      console.error(
        "Failed to create attendance session:",
        err
      );

      /*
       * Backend returns 409 when another
       * active session already exists.
       */

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to create attendance session."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  /*
   * =====================================================
   * CLOSE CURRENT SESSION
   * =====================================================
   */

  async function closeCurrentSession() {
    try {
      setError(null);
      setSuccess(null);

      if (!sessionId) {
        setError(
          "No active attendance session found."
        );

        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to close this attendance session?"
      );

      if (!confirmed) {
        return;
      }

      setLoading(true);

      await closeAttendanceSession(
        sessionId
      );

      /*
       * Remove current QR from UI
       */

      setSessionUrl(null);
      setSessionId(null);
      setSession(null);

      setSuccess(
        "Attendance session closed successfully. You can now create a new session."
      );

    } catch (err) {
      console.error(
        "Failed to close attendance session:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to close attendance session."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  /*
   * =====================================================
   * FORMAT DATE
   * =====================================================
   */

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
  }

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      {/* =================================================
          FORM
      ================================================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          Attendance Session
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new session for your class.
        </p>

        <div className="mt-6 space-y-5">

          {/* =============================================
              CLASS
          ============================================= */}

          <div>

            <label
              htmlFor="className"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Class / Section
            </label>

            <select
              id="className"
              value={className}
              onChange={(e) =>
                setClassName(
                  e.target.value
                )
              }
              disabled={
                loading ||
                loadingSession ||
                !!sessionUrl
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            >

              <option value="">
                Select class/section
              </option>

              <option value="Coding School">
                Coding School
              </option>

            </select>

          </div>

          {/* =============================================
              SUBJECT
          ============================================= */}

          <div>

            <label
              htmlFor="subject"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Subject
            </label>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(
                  e.target.value
                )
              }
              placeholder="Frontend development"
              disabled={
                loading ||
                loadingSession ||
                !!sessionUrl
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

          </div>

          {/* =============================================
              DESCRIPTION
          ============================================= */}

          <div>

            <label
              htmlFor="description"
              className="mb-2 block text-xs font-medium text-slate-600"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Optional description..."
              disabled={
                loading ||
                loadingSession ||
                !!sessionUrl
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

          </div>

          {/* =============================================
              LOADING CURRENT SESSION
          ============================================= */}

          {loadingSession && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">

              <p className="text-sm text-blue-600">
                Checking for an active attendance session...
              </p>

            </div>
          )}

          {/* =============================================
              ERROR
          ============================================= */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}

          {/* =============================================
              SUCCESS
          ============================================= */}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">

              <p className="text-sm text-green-600">
                {success}
              </p>

            </div>
          )}

          {/* =============================================
              ACTIVE SESSION INFORMATION
          ============================================= */}

          {session && sessionUrl && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-medium text-blue-600">
                    Active Session
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {session.subject}
                  </p>

                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  ACTIVE
                </span>

              </div>

              <div className="mt-3 space-y-1">

                <p className="text-xs text-slate-500">
                  Created:{" "}
                  <span className="font-medium text-slate-700">
                    {formatDate(
                      session.createdAt
                    )}
                  </span>
                </p>

                <p className="text-xs text-slate-500">
                  Expires:{" "}
                  <span className="font-medium text-slate-700">
                    {formatDate(
                      session.expiresAt
                    )}
                  </span>
                </p>

              </div>

            </div>
          )}

          {/* =============================================
              GENERATE BUTTON
          ============================================= */}

          {!sessionUrl && (
            <Button
              onClick={generateQR}
              className="w-full"
              disabled={
                loading ||
                loadingSession
              }
            >
              {loading
                ? "Creating Session..."
                : "Generate QR Code"}
            </Button>
          )}

          {/* =============================================
              CLOSE SESSION BUTTON
          ============================================= */}

          {sessionUrl && (
            <Button
              onClick={
                closeCurrentSession
              }
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Closing Session..."
                : "Close Session"}
            </Button>
          )}

        </div>

      </div>

      {/* =================================================
          QR PREVIEW
      ================================================= */}

      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          QR Code Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Students scan this code to mark attendance.
        </p>

        {loadingSession ? (

          <div className="mt-10 flex h-[260px] w-[260px] items-center justify-center rounded-xl bg-slate-50 text-center text-sm text-slate-400">
            Loading QR code...
          </div>

        ) : sessionUrl ? (

          <>

            {/* =========================================
                QR CODE
            ========================================= */}

            <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

              <QRCodeCanvas
                value={sessionUrl}
                size={260}
                level="H"
              />

            </div>

            {/* =========================================
                STATUS
            ========================================= */}

            <p className="mt-5 text-xs font-medium text-green-600">
              Active attendance session
            </p>

            {/* =========================================
                EXPIRATION
            ========================================= */}

            {session && (
              <p className="mt-1 text-xs text-slate-500">
                Expires:{" "}
                {formatDate(
                  session.expiresAt
                )}
              </p>
            )}

            {/* =========================================
                APP URL
            ========================================= */}

            <p className="mt-2 max-w-md break-all text-center text-xs text-slate-500">
              {sessionUrl}
            </p>

          </>

        ) : (

          <div className="mt-10 flex h-[260px] w-[260px] items-center justify-center rounded-xl bg-slate-50 text-center text-sm text-slate-400">
            QR code will appear here
          </div>

        )}

      </div>

    </div>
  );
}