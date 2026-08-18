const express = require("express");

const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deactivateStudent,
} = require(
  "../controllers/studentController"
);

const router = express.Router();

router.post(
  "/",
  createStudent
);

router.get(
  "/",
  getStudents
);

router.get(
  "/:id",
  getStudent
);

router.put(
  "/:id",
  updateStudent
);

router.patch(
  "/:id/deactivate",
  deactivateStudent
);

module.exports = router;