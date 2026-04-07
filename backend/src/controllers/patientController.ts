import { Request, Response } from "express";
import Patient from "../models/patientModel";

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
