import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  markAsDone,
} from "../controllers/appointmentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect); // all routes protected

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id/done", markAsDone);

export default router;
