"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import Button from "@/components/ui/Button";

export default function QRGenerator() {

  const [sessionUrl, setSessionUrl] =
    useState<string | null>(null);

  function generateQR() {

    /*
     * Later this will come from:
     *
     * POST /api/attendance/create-session
     *
     * For now we use a test session.
     */

    const sessionId =
      crypto.randomUUID();

    const url =
      `http://192.168.1.174:3000/attendance/scan?session=${sessionId}`;

    setSessionUrl(url);
  }


  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      {/* Form */}

      <div className="rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          Attendance Session
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new session for your class.
        </p>


        <div className="mt-6 space-y-5">

          <div>

            <label className="mb-2 block text-xs font-medium text-slate-600">
              Class / Section
            </label>

            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none">
              <option>Select class/section</option>
              <option>S4A</option>
              <option>S4B</option>
            </select>

          </div>


          <div>

            <label className="mb-2 block text-xs font-medium text-slate-600">
              Subject
            </label>

            <input
              placeholder="Web Development"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
            />

          </div>


          <div>

            <label className="mb-2 block text-xs font-medium text-slate-600">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Optional description..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
            />

          </div>


          <Button
            onClick={generateQR}
            className="w-full"
          >
            Generate QR Code
          </Button>

        </div>

      </div>


      {/* QR Preview */}

      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6">

        <h2 className="text-base font-bold text-slate-800">
          QR Code Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Students scan this code to mark attendance.
        </p>


        {sessionUrl ? (

          <>

            <div className="mt-8 rounded-xl border border-slate-100 p-5 shadow-sm">

              <QRCodeCanvas
                value={sessionUrl}
                size={260}
                level="H"
              />

            </div>


            <p className="mt-5 text-xs text-slate-400">
              Session created successfully
            </p>

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