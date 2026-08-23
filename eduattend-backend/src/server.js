const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const reportRouter = require("./routes/reportRouter");

const attendanceRoutes = require(
  "./routes/attendanceRoutes"
);

const studentRoutes = require(
  "./routes/studentRoutes"
);

dotenv.config();

const app = express();


// ======================================================
// CONNECT DATABASE
// ======================================================

connectDB();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "EduAttend API is running",
  });
});


// ======================================================
// ROUTES
// ======================================================

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/reports",
  reportRouter
);


// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// ======================================================
// SERVER
// ======================================================

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