import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const attendance = [
  {
    name: "Alice Umuhoza",
    code: "ST001",
    status: "Present" as const,
    time: "08:03 AM",
  },
  {
    name: "Brian Nyamugabo",
    code: "ST002",
    status: "Present" as const,
    time: "08:05 AM",
  },
  {
    name: "Chris Hakizimana",
    code: "ST003",
    status: "Present" as const,
    time: "08:07 AM",
  },
  {
    name: "Diane Mukamana",
    code: "ST004",
    status: "Absent" as const,
    time: "-",
  },
];

const columns = [
  {
    key: "number",
    header: "#",
    render: (_: any, index: number) =>
      index + 1,
  },
  {
    key: "name",
    header: "Student Name",
    render: (item: any) =>
      item.name,
  },
  {
    key: "code",
    header: "Student Code",
    render: (item: any) =>
      item.code,
  },
  {
    key: "status",
    header: "Status",
    render: (item: any) => (
      <StatusBadge status={item.status} />
    ),
  },
  {
    key: "time",
    header: "Time",
    render: (item: any) =>
      item.time,
  },
];

export default function AttendancePage() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Attendance"
        description="Monitor the current attendance session"
        action={
          <div className="flex gap-2">

            <Button variant="secondary">
              View QR Code
            </Button>

            <Button variant="danger">
              Close Session
            </Button>

          </div>
        }
      />


      {/* Session summary */}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-slate-400">
            Session Status
          </p>

          <div className="mt-2">
            <StatusBadge status="Active" />
          </div>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-slate-400">
            Session ID
          </p>

          <p className="mt-2 text-sm font-semibold">
            67ab7d...
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-slate-400">
            Present
          </p>

          <p className="mt-2 text-xl font-bold text-green-600">
            96
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-xs text-slate-400">
            Total Students
          </p>

          <p className="mt-2 text-xl font-bold">
            120
          </p>
        </div>

      </div>


      <h2 className="mb-3 text-sm font-bold">
        Today's Attendance
      </h2>

      <DataTable
        columns={columns}
        data={attendance}
      />

    </DashboardLayout>
  );
}