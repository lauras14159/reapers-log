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
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      message: error.message,
      name: error.name,
      errors: error.errors,
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
