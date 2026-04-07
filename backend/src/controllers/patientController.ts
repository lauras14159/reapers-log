import { Request, Response } from "express";
import Patient from "../models/patientModel";

export const getPatients = async (req: Request, res: Response) => {
  const patients = await Patient.find();
  res.json(patients);
};

export const createPatient = async (req: Request, res: Response) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
};
