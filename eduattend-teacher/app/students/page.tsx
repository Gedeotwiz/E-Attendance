"use client";

import { useEffect, useMemo, useState } from "react";
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

import {
  getStudents,
} from "@/lib/students";

import { Student } from "@/types/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Fetch Students
  |--------------------------------------------------------------------------
  */

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudents();

      setStudents(data.students);

    } catch (error) {
      console.error(
        "Failed to fetch students:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load students."
      );

    } finally {
      setLoading(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Load students when page opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadStudents();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | Search Students
  |--------------------------------------------------------------------------
  */

  const filteredStudents = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter((student) =>
      student.name
        .toLowerCase()
        .includes(value) ||

      student.studentCode
        .toLowerCase()
        .includes(value) ||

      student.className
        .toLowerCase()
        .includes(value)
    );

  }, [students, search]);


  /*
  |--------------------------------------------------------------------------
  | Table Columns
  |--------------------------------------------------------------------------
  */

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
      key: "class",
      header: "Email",

      render: (student: Student) =>
        student.email,
    },

    {
      key: "class",
      header: "Phone Number",

      render: (student: Student) =>
        student.phone,
    },
     {
      key: "code",
      header: "Student Code",

      render: (student: Student) =>
        student.studentCode,
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

        <div className="flex items-center gap-3">

          <button
            type="button"
            title="Edit student"
            onClick={() => {
              console.log(
                "Edit student:",
                student._id
              );
            }}
            className="
              text-slate-400
              transition
              hover:text-blue-600
            "
          >
            <Pencil size={16} />
          </button>


          <button
            type="button"
            title="Delete student"
            onClick={() => {
              console.log(
                "Delete student:",
                student._id
              );
            }}
            className="
              text-slate-400
              transition
              hover:text-red-600
            "
          >
            <Trash2 size={16} />
          </button>

        </div>

      ),
    },
  ];


  return (
    <DashboardLayout>

      <PageHeader
        title="Students"
        description="Manage all registered students"

        action={

          <Button
            type="button"
            onClick={() => {
              console.log(
                "Open add student form"
              );
            }}
          >

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
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search students..."

          className="
            w-full
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-4
            py-2.5
            text-sm
            outline-none
            transition

            focus:border-blue-400
            focus:bg-white
          "
        />

      </div>


      {/* Error */}

      {error && (

        <div
          className="
            mb-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
          "
        >

          <div className="flex items-center justify-between">

            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadStudents}
              className="
                text-sm
                font-medium
                text-red-700
                underline
              "
            >
              Try again
            </button>

          </div>

        </div>

      )}


      {/* Loading */}

      {loading ? (

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-10
            text-center
          "
        >

          <p className="text-sm text-slate-500">
            Loading students...
          </p>

        </div>

      ) : (

        <>

          {/* Student count */}

          <div className="mb-3 text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filteredStudents.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {students.length}
            </span>

            {" "}students

          </div>


          {/* Reusable DataTable */}

          <DataTable
            columns={columns}
            data={filteredStudents}
          />

        </>

      )}

    </DashboardLayout>
  );
}