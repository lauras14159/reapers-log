import express from "express";
import { getPatients, createPatient } from "../controllers/patientController";

const router = express.Router();

router.get("/", getPatients);
router.post("/", createPatient);

export default router;
