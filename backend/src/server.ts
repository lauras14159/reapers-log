import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import { connectDB } from "./config/db";
import patientRoutes from "./routes/patientRoutes";
import authRoutes from "./routes/authRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import { protect } from "./middleware/authMiddleware";
import { sendReminders } from "./controllers/appointmentController";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://reapers-log.vercel.app",
];

app.use(
  cors({
    origin: function (origin: any, callback: any) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", protect, patientRoutes);
app.use("/api/appointments", appointmentRoutes);

// ron job - check reminders every 5 minutes
cron.schedule("*/5 * * * *", () => {
  sendReminders();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
