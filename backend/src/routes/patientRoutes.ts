import express from "express";
import {
  getPatients,
  createPatient,
  deletePatient,
  updatePatient,
} from "../controllers/patientController";

const router = express.Router();

router.get("/", getPatients);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
// router.patch("/:id/archive", archivePatient);
// router.patch("/:id/unarchive", unarchivePatient);

export default router;
