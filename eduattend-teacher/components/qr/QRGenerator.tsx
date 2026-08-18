"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import Button from "@/components/ui/Button";

import {
  createAttendanceSession,
} from "@/lib/attendance";

export default function QRGenerator() {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [sessionUrl, setSessionUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  async function generateQR() {
    try {
      setError(null);
      setSuccess(null);

      // Validate class
      if (!className) {
        setError("Please select a class.");
        return;
      }

      // Validate subject
      if (!subject.trim()) {
        setError("Please enter the subject.");
        return;
      }

      setLoading(true);

      // Create attendance session
      const response =
        await createAttendanceSession({
          className,
          subject,
          description,
        });

      console.log(
        "Attendance session:",
        response
      );

      /*
       * Use the URL returned by the backend.
       *
       * Example:
       * eduattend://attendance/scan?session=f359...
       */
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

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      {/* ================= FORM ================= */}

      <div className="rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          Attendance Session
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new session for your class.
        </p>

        <div className="mt-6 space-y-5">

          {/* Class */}

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
                setClassName(e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >

              <option value="">
                Select class/section
              </option>

              <option value="Coding School">
                Coding School
              </option>

            </select>

          </div>

          {/* Subject */}

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
                setSubject(e.target.value)
              }
              placeholder="Frontend development"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* Description */}

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
                setDescription(e.target.value)
              }
              placeholder="Optional description..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-600">
                {success}
              </p>
            </div>
          )}

          {/* Generate Button */}

          <Button
            onClick={generateQR}
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating Session..."
              : "Generate QR Code"}
          </Button>

        </div>

      </div>

      {/* ================= QR PREVIEW ================= */}

      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          QR Code Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Students scan this code to mark attendance.
        </p>

        {sessionUrl ? (

          <>

            {/* QR Code */}

            <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

              <QRCodeCanvas
                value={sessionUrl}
                size={260}
                level="H"
              />

            </div>

            {/* Success */}

            <p className="mt-5 text-xs font-medium text-green-600">
              Session created successfully
            </p>

            {/* App URL */}

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