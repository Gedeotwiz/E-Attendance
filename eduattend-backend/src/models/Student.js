const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
     phone:{
         type: String,
      trim: true,
      unique: true,
     },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);