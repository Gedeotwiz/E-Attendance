const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Use local date parts (not toISOString, which converts to UTC and can
// shift the calendar day when the server isn't running in UTC — this must
// match the local-time boundaries used to build startDate/endDate below).
const getDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ============================================
// SHARED: BUILD REPORT DATA
// Both the JSON endpoint and the export endpoint use this so the numbers
// always match exactly what the dashboard shows.
// ============================================
async function buildReportData(period, date) {
  if (!["daily", "weekly", "monthly"].includes(period)) {
    const err = new Error("Period must be daily, weekly, or monthly");
    err.status = 400;
    throw err;
  }

  // 1. DATE RANGE
  let startDate, endDate;
  const now = new Date();

  if (period === "daily") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }
  if (period === "weekly") {
    const day = now.getDay();
    const difference = day === 0 ? 6 : day - 1;
    startDate = new Date(now);
    startDate.setDate(now.getDate() - difference);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
  }
  if (period === "monthly") {
    if (!date || !/^\d{4}-\d{2}$/.test(date)) {
      const err = new Error("Monthly date must be in YYYY-MM format");
      err.status = 400;
      throw err;
    }
    const [year, month] = date.split("-").map(Number);
    startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    endDate = new Date(year, month, 0, 23, 59, 59, 999);
  }

  // 2. FETCH DATA
  const totalStudents = await Student.countDocuments();
  const sessions = await AttendanceSession.find({ createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: 1 });
  const totalSessions = sessions.length;
  const sessionIds = sessions.map((s) => s._id);

  const attendance = sessionIds.length
    ? await Attendance.find({ session: { $in: sessionIds } }).populate("student")
    : [];

  // 3. BUILD ROWS PER DAY
  const rowsMap = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = getDateKey(d);
    rowsMap[key] = { date: key, sessions: 0, present: 0, absent: 0, rate: 0 };
  }

  for (const session of sessions) {
    const key = getDateKey(new Date(session.createdAt));
    if (rowsMap[key]) rowsMap[key].sessions++;
  }

  const attendanceBySession = {};
  for (const item of attendance) {
    const sid = String(item.session);
    if (!attendanceBySession[sid]) attendanceBySession[sid] = new Set();
    if (String(item.status).toLowerCase() === "present") {
      attendanceBySession[sid].add(String(item.student._id));
    }
  }

  for (const session of sessions) {
    const key = getDateKey(new Date(session.createdAt));
    const presentInSession = attendanceBySession[String(session._id)]?.size || 0;
    if (rowsMap[key]) rowsMap[key].present += presentInSession;
  }

  const rows = Object.values(rowsMap).map((row) => {
    const expected = totalStudents * row.sessions;
    row.absent = Math.max(expected - row.present, 0);
    row.rate = expected > 0 ? Number(((row.present / expected) * 100).toFixed(2)) : 0;
    return row;
  });

  // 4. SUMMARY
  const totalPresent = rows.reduce((sum, r) => sum + r.present, 0);
  const totalExpected = rows.reduce((sum, r) => sum + totalStudents * r.sessions, 0);
  const totalAbsent = totalExpected - totalPresent;
  const attendanceRate = totalExpected > 0 ? Number(((totalPresent / totalExpected) * 100).toFixed(2)) : 0;

  // 5. CHART
  const chart = rows.map((row) => ({
    name: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: row.rate,
  }));

  // 6. TOP STUDENTS
  const studentStats = {};
  for (const item of attendance) {
    if (String(item.status).toLowerCase() !== "present") continue;
    const studentId = String(item.student._id);
    if (!studentStats[studentId]) studentStats[studentId] = { present: 0, student: item.student };
    studentStats[studentId].present++;
  }

  const topStudents = Object.values(studentStats)
    .map((s) => ({
      name: s.student.name,
      studentCode: s.student.studentCode,
      present: s.present,
      totalSessions,
      rate: totalSessions > 0 ? Number(((s.present / totalSessions) * 100).toFixed(2)) : 0,
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)
    .map((student, index) => ({ rank: index + 1, ...student }));

  return {
    period,
    startDate,
    endDate,
    summary: { totalStudents, totalSessions, totalPresent, totalAbsent, attendanceRate },
    chart,
    topStudents,
    rows,
  };
}

// ============================================
// JSON REPORT ENDPOINT
// ============================================
const getAttendanceReport = async (req, res) => {
  try {
    const { period = "daily", date } = req.query;
    const report = await buildReportData(period, date);

    return res.status(200).json({
      ...report,
      startDate: report.startDate.toISOString(),
      endDate: report.endDate.toISOString(),
    });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Get attendance report error:", error);
    return res.status(500).json({ message: "Failed to generate attendance report", error: error.message });
  }
};

// ============================================
// EXPORT HELPERS
// ============================================

function periodLabel(period, report) {
  const start = report.startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const end = report.endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  if (period === "daily") return `Daily Report - ${start}`;
  if (period === "weekly") return `Weekly Report - ${start} to ${end}`;
  return `Monthly Report - ${start} to ${end}`;
}

function buildCsv(report) {
  const header = ["Date", "Sessions", "Present", "Absent", "Attendance Rate (%)"];
  const lines = [header.join(",")];

  for (const row of report.rows) {
    lines.push([row.date, row.sessions, row.present, row.absent, row.rate].join(","));
  }

  lines.push("");
  lines.push("Summary");
  lines.push(`Total Students,${report.summary.totalStudents}`);
  lines.push(`Total Sessions,${report.summary.totalSessions}`);
  lines.push(`Total Present,${report.summary.totalPresent}`);
  lines.push(`Total Absent,${report.summary.totalAbsent}`);
  lines.push(`Attendance Rate,${report.summary.attendanceRate}%`);

  if (report.topStudents.length) {
    lines.push("");
    lines.push("Top Students");
    lines.push(["Rank", "Name", "Student Code", "Present", "Total Sessions", "Rate (%)"].join(","));
    for (const s of report.topStudents) {
      lines.push([s.rank, s.name, s.studentCode, s.present, s.totalSessions, s.rate].join(","));
    }
  }

  return lines.join("\n");
}

async function buildXlsx(report, period) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Attendance System";
  workbook.created = new Date();

  // --- Summary sheet ---
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 25 },
    { header: "Value", key: "value", width: 20 },
  ];
  summarySheet.getRow(1).font = { bold: true };
  summarySheet.addRows([
    { metric: "Report Period", value: periodLabel(period, report) },
    { metric: "Total Students", value: report.summary.totalStudents },
    { metric: "Total Sessions", value: report.summary.totalSessions },
    { metric: "Total Present", value: report.summary.totalPresent },
    { metric: "Total Absent", value: report.summary.totalAbsent },
    { metric: "Attendance Rate", value: `${report.summary.attendanceRate}%` },
  ]);

  // --- Daily breakdown sheet ---
  const detailsSheet = workbook.addWorksheet("Attendance Details");
  detailsSheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Sessions", key: "sessions", width: 12 },
    { header: "Present", key: "present", width: 12 },
    { header: "Absent", key: "absent", width: 12 },
    { header: "Rate (%)", key: "rate", width: 12 },
  ];
  detailsSheet.getRow(1).font = { bold: true };
  detailsSheet.addRows(report.rows);

  // --- Top students sheet ---
  if (report.topStudents.length) {
    const topSheet = workbook.addWorksheet("Top Students");
    topSheet.columns = [
      { header: "Rank", key: "rank", width: 8 },
      { header: "Name", key: "name", width: 25 },
      { header: "Student Code", key: "studentCode", width: 18 },
      { header: "Present", key: "present", width: 12 },
      { header: "Total Sessions", key: "totalSessions", width: 15 },
      { header: "Rate (%)", key: "rate", width: 12 },
    ];
    topSheet.getRow(1).font = { bold: true };
    topSheet.addRows(report.topStudents);
  }

  return workbook;
}

function buildPdf(report, period) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  doc.fontSize(18).text("Attendance Report", { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor("#555").text(periodLabel(period, report), { align: "center" });
  doc.moveDown(1.2);
  doc.fillColor("#000");

  // Summary
  doc.fontSize(13).text("Summary", { underline: true });
  doc.moveDown(0.4);
  doc.fontSize(10);
  const s = report.summary;
  doc.text(`Total Students: ${s.totalStudents}`);
  doc.text(`Total Sessions: ${s.totalSessions}`);
  doc.text(`Total Present: ${s.totalPresent}`);
  doc.text(`Total Absent: ${s.totalAbsent}`);
  doc.text(`Attendance Rate: ${s.attendanceRate}%`);
  doc.moveDown(1);

  // Daily breakdown table
  doc.fontSize(13).text("Attendance Details", { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const colX = { date: 40, sessions: 180, present: 260, absent: 340, rate: 420 };

  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Date", colX.date, tableTop);
  doc.text("Sessions", colX.sessions, tableTop);
  doc.text("Present", colX.present, tableTop);
  doc.text("Absent", colX.absent, tableTop);
  doc.text("Rate (%)", colX.rate, tableTop);
  doc.font("Helvetica");
  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(520, doc.y).strokeColor("#ccc").stroke();
  doc.moveDown(0.3);

  for (const row of report.rows) {
    if (doc.y > 740) {
      doc.addPage();
    }
    const y = doc.y;
    doc.text(row.date, colX.date, y);
    doc.text(String(row.sessions), colX.sessions, y);
    doc.text(String(row.present), colX.present, y);
    doc.text(String(row.absent), colX.absent, y);
    doc.text(String(row.rate), colX.rate, y);
    doc.moveDown(0.6);
  }

  // Top students
  if (report.topStudents.length) {
    doc.moveDown(1);
    if (doc.y > 680) doc.addPage();
    doc.fontSize(13).text("Top Students", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    for (const st of report.topStudents) {
      doc.text(`${st.rank}. ${st.name} (${st.studentCode}) — ${st.present}/${st.totalSessions} — ${st.rate}%`);
    }
  }

  doc.end();
  return doc;
}

// ============================================
// EXPORT ENDPOINT
// ============================================
const exportAttendanceReport = async (req, res) => {
  try {
    const { period = "monthly", date, format } = req.query;

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return res.status(400).json({ message: "Period must be daily, weekly, or monthly" });
    }
    if (!["pdf", "xlsx", "csv"].includes(format)) {
      return res.status(400).json({ message: "Format must be pdf, xlsx, or csv" });
    }
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const report = await buildReportData(period, period === "monthly" ? date : undefined);
    const filenameDate = period === "monthly" ? date : getDateKey(new Date());
    const filename = `attendance-report-${period}-${filenameDate}`;

    if (format === "csv") {
      const csv = buildCsv(report);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
      return res.status(200).send(csv);
    }

    if (format === "xlsx") {
      const workbook = await buildXlsx(report, period);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}.xlsx"`);
      await workbook.xlsx.write(res);
      return res.end();
    }

    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);
      const doc = buildPdf(report, period);
      doc.pipe(res);
      return;
    }
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Export attendance report error:", error);
    return res.status(500).json({ message: "Failed to export attendance report", error: error.message });
  }
};

module.exports = { getAttendanceReport, exportAttendanceReport };
