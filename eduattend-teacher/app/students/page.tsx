"use client";

import {
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Student } from "@/types/student";

const students: Student[] = [
  {
    _id: "1",
    name: "Alice Umuhoza",
    studentCode: "ST001",
    className: "S4A",
    status: "Active",
  },
  {
    _id: "2",
    name: "Brian Nyamugabo",
    studentCode: "ST002",
    className: "S4A",
    status: "Active",
  },
  {
    _id: "3",
    name: "Chris Hakizimana",
    studentCode: "ST003",
    className: "S4B",
    status: "Active",
  },
  {
    _id: "4",
    name: "Diane Mukamana",
    studentCode: "ST004",
    className: "S4B",
    status: "Inactive",
  },
];

const columns = [
  {
    key: "number",
    header: "#",
    render: (
      _: Student,
      index: number
    ) => index + 1,
  },

  {
    key: "name",
    header: "Student Name",
    render: (student: Student) =>
      student.name,
  },

  {
    key: "code",
    header: "Student Code",
    render: (student: Student) =>
      student.studentCode,
  },

  {
    key: "class",
    header: "Class/Section",
    render: (student: Student) =>
      student.className,
  },

  {
    key: "status",
    header: "Status",
    render: (student: Student) => (
      <StatusBadge
        status={student.status}
      />
    ),
  },

  {
    key: "actions",
    header: "Actions",
    render: (student: Student) => (

      <div className="flex gap-2">

        <button
          className="text-slate-400 hover:text-blue-600"
        >
          <Pencil size={15} />
        </button>

        <button
          className="text-slate-400 hover:text-red-600"
        >
          <Trash2 size={15} />
        </button>

      </div>

    ),
  },
];

export default function StudentsPage() {
  return (
    <DashboardLayout>

      <PageHeader
        title="Students"
        description="Manage all registered students"
        action={
          <Button>
            <span className="flex items-center gap-2">
              <Plus size={16} />
              Add Student
            </span>
          </Button>
        }
      />


      {/* Search */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">

        <input
          type="text"
          placeholder="Search students..."
          className="
            w-full rounded-lg
            border border-slate-200
            bg-slate-50
            px-4 py-2.5
            text-sm outline-none
            focus:border-blue-400
          "
        />

      </div>


      <DataTable
        columns={columns}
        data={students}
      />

    </DashboardLayout>
  );
}