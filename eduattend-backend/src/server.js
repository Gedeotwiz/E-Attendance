const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require(
  "./config/db"
);

const attendanceRoutes = require(
  "./routes/attendanceRoutes"
);

const studentRoutes = require(
  "./routes/studentRoutes"
);

dotenv.config();

const app = express();


// Connect MongoDB

connectDB();


// Middleware

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


// Health check

app.get("/", (req, res) => {
  res.json({
    message:
      "EduAttend API is running",
  });
});


// Routes

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/students",
  studentRoutes
);


// 404

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// Server

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `EduAttend API running on port ${PORT}`
    );
  }
);