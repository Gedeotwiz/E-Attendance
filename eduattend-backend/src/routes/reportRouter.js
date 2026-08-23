const express = require("express");

const {
  getAttendanceReport,
  exportAttendanceReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getAttendanceReport);

router.get("/export", exportAttendanceReport);

module.exports = router;