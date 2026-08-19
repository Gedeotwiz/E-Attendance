const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const generateSessionToken = require(
  "../utils/generateSessionToken"
);


// ============================================
// CREATE ATTENDANCE SESSION
// ============================================

const createSession = async (req, res) => {
  try {
    const {
      className,
      subject,
      description,
    } = req.body;

    if (!className) {
      return res.status(400).json({
        message: "Class/section is required",
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    // Check current active session
    const activeSession =
      await AttendanceSession.findOne({
        status: "ACTIVE",
      });

    if (activeSession) {
      // Check if it has expired
      if (
        new Date() >=
        new Date(activeSession.expiresAt)
      ) {
        activeSession.status = "EXPIRED";

        await activeSession.save();
      } else {
        // Still active
        return res.status(409).json({
          message:
            "An attendance session is already active.",
          session: activeSession,
          studentAppUrl:
            `eduattend://attendance/scan?session=${activeSession.sessionId}`,
        });
      }
    }

    // Create new session
    const sessionId =
      generateSessionToken();

    const createdAt = new Date();

    // Valid for 13 hours
    const expiresAt = new Date(
      createdAt.getTime() +
        13 * 60 * 60 * 1000
    );

    const session =
      await AttendanceSession.create({
        sessionId,
        className,
        subject,
        description,
        createdAt,
        expiresAt,
        status: "ACTIVE",
      });

    const studentAppUrl =
      `eduattend://attendance/scan?session=${sessionId}`;

    return res.status(201).json({
      message:
        "Attendance session created successfully",

      session: {
        id: session._id,
        sessionId: session.sessionId,
        className: session.className,
        subject: session.subject,
        description: session.description,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
      },

      studentAppUrl,
    });

  } catch (error) {
    console.error(
      "Create session error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create attendance session",
      error: error.message,
    });
  }
};


// ============================================
// MARK ATTENDANCE
// ============================================

const markAttendance = async (req, res) => {
  try {
    const { sessionId, studentCode } = req.body;

    if (!sessionId || !studentCode) {
      return res.status(400).json({
        message:
          "Session ID and student code are required",
      });
    }

    const session =
      await AttendanceSession.findOne({
        sessionId,
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Attendance session not found",
      });
    }

    if (session.status !== "ACTIVE") {
      return res.status(400).json({
        message:
          "This attendance session is no longer active",
      });
    }

    const now = new Date();

    if (now > session.expiresAt) {
      session.status = "EXPIRED";

      await session.save();

      return res.status(400).json({
        message:
          "This attendance session has expired",
      });
    }

    const student =
      await Student.findOne({
        studentCode:
          studentCode.toUpperCase().trim(),
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (student.status !== "Active") {
      return res.status(403).json({
        message:
          "This student is inactive",
      });
    }

    if (
      student.className !==
      session.className
    ) {
      return res.status(403).json({
        message:
          "Student does not belong to this class/session",
      });
    }

    const existingAttendance =
      await Attendance.findOne({
        student: student._id,
        session: session._id,
      });

    if (existingAttendance) {
      return res.status(409).json({
        message:
          "Attendance already recorded",
        attendance: existingAttendance,
      });
    }

    const attendance =
      await Attendance.create({
        student: student._id,
        session: session._id,
        studentCode:
          student.studentCode,
        status: "Present",
        scannedAt: new Date(),
      });

    return res.status(201).json({
      message:
        "Attendance marked successfully",

      attendance: {
        id: attendance._id,
        studentName: student.name,
        studentCode:
          student.studentCode,
        className:
          student.className,
        status:
          attendance.status,
        scannedAt:
          attendance.scannedAt,
      },
    });

  } catch (error) {
    console.error(
      "Mark attendance error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Attendance already recorded",
      });
    }

    return res.status(500).json({
      message:
        "Failed to mark attendance",
      error: error.message,
    });
  }
};


// ============================================
// GET CURRENT SESSION
// ============================================

const getCurrentSession = async (req, res) => {
  try {
    let session =
      await AttendanceSession.findOne({
        status: "ACTIVE",
      }).sort({
        createdAt: -1,
      });

    if (!session) {
      return res.status(404).json({
        message:
          "No active attendance session",
      });
    }

    // Check expiration
    if (
      new Date() >=
      new Date(session.expiresAt)
    ) {
      session.status = "EXPIRED";

      await session.save();

      return res.status(404).json({
        message:
          "Attendance session has expired",
      });
    }

    const studentAppUrl =
      `eduattend://attendance/scan?session=${session.sessionId}`;

    return res.status(200).json({
      message:
        "Active attendance session found",

      session: {
        id: session._id,
        sessionId: session.sessionId,
        className: session.className,
        subject: session.subject,
        description: session.description,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
      },

      studentAppUrl,
    });

  } catch (error) {
    console.error(
      "Get current session error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to get current attendance session",
      error: error.message,
    });
  }
};


// ============================================
// GET SESSION ATTENDANCE
// ============================================

const getSessionAttendance = async (
  req,
  res
) => {
  try {
    const { sessionId } =
      req.params;

    if (!sessionId) {
      return res.status(400).json({
        message:
          "Session ID is required",
      });
    }

    const session =
      await AttendanceSession.findOne({
        sessionId,
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Attendance session not found",
      });
    }

    const attendanceRecords =
      await Attendance.find({
        session: session._id,
      })
        .populate(
          "student",
          "name studentCode className email"
        )
        .sort({
          scannedAt: 1,
        });

    const totalStudents =
      await Student.countDocuments({
        className:
          session.className,

        status: "Active",
      });

    const totalPresent =
      attendanceRecords.length;

    const totalAbsent =
      Math.max(
        totalStudents -
          totalPresent,
        0
      );

    const attendanceRate =
      totalStudents > 0
        ? Number(
            (
              (totalPresent /
                totalStudents) *
              100
            ).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      message:
        "Session attendance retrieved",

      session: {
        id: session._id,
        sessionId:
          session.sessionId,
        className:
          session.className,
        subject:
          session.subject,
        createdAt:
          session.createdAt,
        expiresAt:
          session.expiresAt,
        status:
          session.status,
      },

      summary: {
        totalStudents,
        totalPresent,
        totalAbsent,
        attendanceRate,
      },

      attendance:
        attendanceRecords.map(
          (record) => ({
            id: record._id,

            student: {
              id:
                record.student?._id,

              name:
                record.student?.name,

              studentCode:
                record.student
                  ?.studentCode,

              className:
                record.student
                  ?.className,
            },

            status:
              record.status,

            scannedAt:
              record.scannedAt,
          })
        ),
    });

  } catch (error) {
    console.error(
      "Get session attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to get session attendance",
      error: error.message,
    });
  }
};


// ============================================
// CLOSE SESSION
// ============================================

const closeSession = async (
  req,
  res
) => {
  try {
    const { sessionId } =
      req.params;

    if (!sessionId) {
      return res.status(400).json({
        message:
          "Session ID is required",
      });
    }

    const session =
      await AttendanceSession.findOne({
        sessionId,
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Attendance session not found",
      });
    }

    if (
      session.status === "CLOSED"
    ) {
      return res.status(400).json({
        message:
          "Attendance session is already closed",
      });
    }

    session.status = "CLOSED";

    await session.save();

    return res.status(200).json({
      message:
        "Attendance session closed successfully",

      session: {
        id: session._id,
        sessionId:
          session.sessionId,
        className:
          session.className,
        subject:
          session.subject,
        status:
          session.status,
        createdAt:
          session.createdAt,
        expiresAt:
          session.expiresAt,
      },
    });

  } catch (error) {
    console.error(
      "Close session error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to close attendance session",
      error: error.message,
    });
  }
};


// ============================================
// EXPORT
// ============================================

module.exports = {
  createSession,
  markAttendance,
  getCurrentSession,
  getSessionAttendance,
  closeSession,
};