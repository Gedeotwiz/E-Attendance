const Student = require("../models/Student");


// CREATE STUDENT

const createStudent = async (req, res) => {
  try {
    const {
      name,
      studentCode,
      className,
      phone,
      email,
    } = req.body;

    if (
      !name ||
      !studentCode ||
      !className
    ) {
      return res.status(400).json({
        message:
          "Name, student code and class are required",
      });
    }

    const existingStudent =
      await Student.findOne({
        studentCode,
      });

    if (existingStudent) {
      return res.status(409).json({
        message:
          "Student code already exists",
      });
    }

    const student =
      await Student.create({
        name,
        studentCode,
        className,
        phone,
        email,
      });

    return res.status(201).json({
      message:
        "Student registered successfully",

      student,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to register student",

      error: error.message,
    });
  }
};


// GET ALL STUDENTS

const getStudents = async (req, res) => {
  try {

    const students =
      await Student.find()
        .sort({ createdAt: -1 });

    return res.json({
      count: students.length,
      students,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to fetch students",

      error: error.message,
    });
  }
};


// GET ONE STUDENT

const getStudent = async (req, res) => {
  try {

    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json({
      student,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to fetch student",

      error: error.message,
    });
  }
};


// UPDATE STUDENT

const updateStudent = async (req, res) => {
  try {

    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json({
      message:
        "Student updated successfully",

      student,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to update student",

      error: error.message,
    });
  }
};


// DELETE / DEACTIVATE STUDENT

const deactivateStudent = async (
  req,
  res
) => {
  try {

    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        {
          status: "Inactive",
        },
        {
          new: true,
        }
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    return res.json({
      message:
        "Student deactivated successfully",

      student,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to deactivate student",

      error: error.message,
    });
  }
};


module.exports = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deactivateStudent,
};