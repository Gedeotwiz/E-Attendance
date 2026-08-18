const express = require("express");

const {
  createSession,
  markAttendance,
  getCurrentSession,
  getSessionAttendance,
  closeSession,
} = require(
  "../controllers/attendanceController"
);

const router = express.Router();


// Teacher creates QR attendance session

router.post(
  "/create-session",
  createSession
);


// Student marks attendance

router.post(
  "/mark",
  markAttendance
);


// Get active session

router.get(
  "/current-session",
  getCurrentSession
);


// Get attendance for a session

router.get(
  "/session/:sessionId",
  getSessionAttendance
);


// Teacher closes session

router.patch(
  "/session/:sessionId/close",
  closeSession
);

module.exports = router;