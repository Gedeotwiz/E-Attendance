const mongoose = require("mongoose");

const attendanceSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);