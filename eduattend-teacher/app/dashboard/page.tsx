import {
  Users,
  UserCheck,
  UserX,
  Percent,
  ArrowRight,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";

interface AttendanceRow {
  name: string;
  code: string;
  status: "Present" | "Absent";
  time: string;
}

const attendance: AttendanceRow[] = [
  {
    name: "Alice Umuhoza",
    code: "ST001",
    status: "Present",
    time: "08:03 AM",
  },
  {
    name: "Brian Nyamugabo",
    code: "ST002",
    status: "Present",
    time: "08:05 AM",
  },
  {
    name: "Chris Hakizimana",
    code: "ST003",
    status: "Present",
    time: "08:07 AM",
  },
  {
    name: "Diane Mukamana",
    code: "ST004",
    status: "Absent",
    time: "-",
  },
  {
    name: "Eric Tuyishime",
    code: "ST005",
    status: "Present",
    time: "08:10 AM",
  },
];

const columns = [
  {
    key: "number",
    header: "#",
    render: (
      _: AttendanceRow,
      index: number
    ) => index + 1,
  },

  {
    key: "name",
    header: "Student Name",
    render: (item: AttendanceRow) =>
      item.name,
  },

  {
    key: "code",
    header: "Student Code",
    render: (item: AttendanceRow) =>
      item.code,
  },

  {
    key: "status",
    header: "Status",
    render: (item: AttendanceRow) => (
      <StatusBadge
        status={item.status}
      />
    ),
  },

  {
    key: "time",
    header: "Time",
    render: (item: AttendanceRow) =>
      item.time,
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* Header */}

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
          Monday, Aug 10, 2026
        </div>

      </div>


      {/* Stats */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Students"
          value="120"
          description="All registered"
          icon={Users}
          variant="blue"
        />

        <StatCard
          title="Present Today"
          value="96"
          description="80% of total"
          icon={UserCheck}
          variant="green"
        />

        <StatCard
          title="Absent Today"
          value="24"
          description="20% of total"
          icon={UserX}
          variant="red"
        />

        <StatCard
          title="Attendance Rate"
          value="80%"
          description="Today's rate"
          icon={Percent}
          variant="purple"
        />

      </div>


      {/* Main content */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">

        {/* Attendance */}

        <div>

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-sm font-bold text-slate-800">
              Today's Attendance
            </h2>

          </div>


          <DataTable
            columns={columns}
            data={attendance}
          />

        </div>


        {/* Quick Actions */}

        <div className="space-y-5">

          <div className="rounded-xl border border-slate-200 bg-white p-5">

            <h2 className="text-sm font-bold text-slate-800">
              Quick Actions
            </h2>


            <div className="mt-4 space-y-3">

              <Button className="w-full">
                Generate QR Code
              </Button>


              <Button
                variant="secondary"
                className="w-full"
              >
                View Reports
              </Button>

            </div>

          </div>


          {/* Weekly chart placeholder */}

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

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}