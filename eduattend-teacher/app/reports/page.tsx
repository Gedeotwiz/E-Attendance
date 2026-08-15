
"use client"

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Users,
  CalendarDays,
  UserCheck,
  Percent,
  Download,
  ChevronDown,
} from "lucide-react";

const reportData = [
  { date: "Aug 10, 2026", sessions: 1, present: 96, absent: 24, rate: "80%" },
  { date: "Aug 9, 2026", sessions: 1, present: 92, absent: 28, rate: "77%" },
];

// Data ya chart
const chartData = [
  { name: "Aug 1", value: 50 },
  { name: "Aug 7", value: 65 },
  { name: "Aug 13", value: 60 },
  { name: "Aug 19", value: 75 },
  { name: "Aug 25", value: 85 },
  { name: "Aug 31", value: 90 },
];

// Top Students
const topStudents = [
  { rank: 1, name: "Alice Umuhiza", rate: "95%" },
  { rank: 2, name: "Brian Nyamugabo", rate: "92%" },
  { rank: 3, name: "Chris Nshimana", rate: "90%" },
  { rank: 4, name: "Eric Tuyishime", rate: "88%" },
];

const columns = [
  { key: "date", header: "Date", render: (item: any) => item.date },
  { key: "sessions", header: "Sessions", render: (item: any) => item.sessions },
  { key: "present", header: "Present", render: (item: any) => item.present },
  { key: "absent", header: "Absent", render: (item: any) => item.absent },
  { key: "rate", header: "Attendance Rate", render: (item: any) => item.rate },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [showExport, setShowExport] = useState(false);
  const tabs = ["Daily", "Weekly", "Monthly"];

  return (
    <DashboardLayout>
      <PageHeader
        title="Reports"
        description="View attendance reports and analytics"
      />

      {/* Tabs + Month + Export */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row sm:items-center">
        {/* Tabs */}
        <div className="inline-flex rounded-lg  p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <select className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>August 2025</option>
            <option>July 2025</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm"
            >
              <Download size={16} />
              Export
              <ChevronDown size={16} />
            </button>
            {showExport && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border bg-white shadow-lg">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export PDF</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export Excel</button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value="120" icon={Users} />
        <StatCard title="Total Sessions" value="18" icon={CalendarDays} />
        <StatCard title="Total Present" value="864" icon={UserCheck} variant="green" />
        <StatCard title="Attendance Rate" value="80%" icon={Percent} variant="purple" />
      </div>

      {/* Chart + Top Students */}
      <div className="mt-6 flex gap-6">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 w-1/2 rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Attendance Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Students */}
        <div className="rounded-xl w-1/2 border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Top Students</h3>
          <div className="space-y-4">
            {topStudents.map((student) => (
              <div key={student.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold">
                    {student.rank}
                  </div>
                  <span className="text-sm font-medium">{student.name}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">{student.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-6">
        <DataTable columns={columns} data={reportData} />
      </div>
    </DashboardLayout>
  );
}