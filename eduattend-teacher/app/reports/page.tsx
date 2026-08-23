"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CalendarDays, UserCheck, Percent, Download, ChevronDown, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { getAttendanceReport, exportAttendanceReport } from "@/lib/reports";
import { AttendanceReportResponse, AttendanceReportRow, ReportPeriod } from "@/types/report";

// ======================================================
// FORMAT DATE - IKOSEWE
// ======================================================
function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMonth(month: string): string {
  if (!month) return "-";
  try {
    return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return "-";
  }
}

function getToday(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const columns = [
  { key: "date", header: "Date", render: (item: AttendanceReportRow) => formatDate(item.date) },
  { key: "sessions", header: "Sessions", render: (item: AttendanceReportRow) => item.sessions },
  { key: "present", header: "Present", render: (item: AttendanceReportRow) => <span className="font-medium text-green-600">{item.present}</span> },
  { key: "absent", header: "Absent", render: (item: AttendanceReportRow) => <span className="font-medium text-red-600">{item.absent}</span> },
  { key: "rate", header: "Attendance Rate", render: (item: AttendanceReportRow) => <span className={`font-semibold ${item.rate >= 75? "text-green-600" : item.rate >= 50? "text-yellow-600" : "text-red-600"}`}>{item.rate}%</span> },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportPeriod>("daily");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [report, setReport] = useState<AttendanceReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const getReportDate = (): string | undefined => {
  if (activeTab === "monthly") return selectedMonth; // 2026-08 gusa, nta -01
  return undefined; 
};

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const reportDate = getReportDate();
      const response = await getAttendanceReport(activeTab, reportDate);
      setReport(response);
    } catch (err) {
      console.error("Failed to fetch attendance report:", err);
      setError("Failed to load attendance report.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [activeTab, selectedMonth]);

  const handlePeriodChange = (period: ReportPeriod) => {
    setActiveTab(period);
    setShowExport(false);
  };

  const handleExport = async (format: "pdf" | "xlsx" | "csv") => {
  try {
    setExporting(true);
    setShowExport(false);
    const reportDate = activeTab === "monthly"? selectedMonth : getToday(); // hano na ho
    exportAttendanceReport(activeTab, reportDate, format);
  } catch (err) {
    console.error("Export error:", err);
    alert("Failed to export report.");
  } finally {
    setExporting(false);
  }
};

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="Reports" description="View attendance reports and analytics" />
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 size={32} className="mx-auto mb-3 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">Loading report...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <PageHeader title="Reports" description="View attendance reports and analytics" />
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">{error}</p>
          <button onClick={fetchReport} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <PageHeader title="Reports" description="View attendance reports and analytics" />
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">No attendance report available.</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPeriodDescription = () => {
    if (activeTab === "daily") return "Today's attendance";
    if (activeTab === "weekly") return "Current week (Monday - Sunday)";
    return `Monthly attendance for ${formatMonth(selectedMonth)}`;
  };

  return (
    <DashboardLayout periodTitle={getPeriodDescription()} periodRange={`${formatDate(report.startDate)} - ${formatDate(report.endDate)}`}>
      <PageHeader title="Reports" description="View attendance reports and analytics" />

      {/* FILTERS */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
          {(["daily", "weekly", "monthly"] as ReportPeriod[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handlePeriodChange(tab)}
              className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                activeTab === tab? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "monthly" && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowExport((prev) =>!prev)}
              disabled={exporting}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Export
              <ChevronDown size={16} />
            </button>
            {showExport && (
              <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                <button onClick={() => handleExport("pdf")} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <FileText size={18} className="text-red-500" /> <span>Export PDF</span>
                </button>
                <button onClick={() => handleExport("xlsx")} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <FileSpreadsheet size={18} className="text-green-600" /> <span>Export Excel</span>
                </button>
                <button onClick={() => handleExport("csv")} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <File size={18} className="text-blue-600" /> <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={String(report.summary.totalStudents)} description="Registered students" icon={Users} variant="blue" />
        <StatCard title="Total Sessions" value={String(report.summary.totalSessions)} description={`${activeTab} sessions`} icon={CalendarDays} variant="blue" />
        <StatCard title="Total Present" value={String(report.summary.totalPresent)} description="Students present" icon={UserCheck} variant="green" />
        <StatCard title="Attendance Rate" value={`${report.summary.attendanceRate}%`} description="Overall attendance" icon={Percent} variant="purple" />
      </div>

      {/* CHART + TOP STUDENTS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-800">Attendance Overview</h3>
            <p className="mt-1 text-xs text-slate-400">Attendance rate for the current report period</p>
          </div>
          {report.chart.length === 0? (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-sm text-slate-400">No chart data available.</p>
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-800">Top Students</h3>
            <p className="mt-1 text-xs text-slate-400">Students with the highest attendance</p>
          </div>
          {report.topStudents.length === 0? (
            <div className="flex h-[220px] items-center justify-center">
              <p className="text-sm text-slate-400">No student attendance data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {report.topStudents.map((student) => (
                <div key={student.studentCode} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{student.rank}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.studentCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-600">{student.rate}%</p>
                    <p className="text-xs text-slate-400">{student.present}/{student.totalSessions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ATTENDANCE DETAILS */}
      <div className="mt-6">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Attendance Details</h3>
            <p className="mt-1 text-xs text-slate-400">{formatDate(report.startDate)} - {formatDate(report.endDate)}</p>
          </div>
          <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">{report.rows.length} records</div>
        </div>
        <DataTable columns={columns} data={report.rows} />
      </div>
    </DashboardLayout>
  );
}