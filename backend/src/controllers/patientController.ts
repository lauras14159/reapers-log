import { Request, Response } from "express";
import Patient from "../models/patientModel";
import { AuthRequest } from "../middleware/authMiddleware";

// export const getPatients = async (req: Request, res: Response) => {
//   try {
//     const patients = await Patient.find();
//     res.json(patients);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// export const createPatient = async (req: Request, res: Response) => {
//   try {
//     const { patientCode: _, ...body } = req.body;
//     const lastPatient = await Patient.findOne()
//       .sort({ _id: -1 })
//       .select("patientCode");

//     let nextNumber = 1;

//     if (lastPatient?.patientCode) {
//       const match = lastPatient.patientCode.match(/\d+/);
//       if (match) nextNumber = parseInt(match[0], 10) + 1;
//     }

//     const patientCode = `P-${String(nextNumber).padStart(3, "0")}`;

//     const patient = await Patient.create({
//       ...body,
//       patientCode,
//     });

//     return res.status(201).json(patient);
//   } catch (error: any) {
//     return res.status(500).json({
//       message: error.message,
//       name: error.name,
//       errors: error.errors,
//     });
//   }
// };

export const getPatients = async (req: AuthRequest, res: Response) => {
  try {
    const patients = await Patient.find({ userId: req.userId });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const { patientCode: _, ...body } = req.body;
    const lastPatient = await Patient.findOne({ userId: req.userId })
      .sort({ _id: -1 })
      .select("patientCode");

    let nextNumber = 1;
    if (lastPatient?.patientCode) {
      const match = lastPatient.patientCode.match(/\d+/);
      if (match) nextNumber = parseInt(match[0], 10) + 1;
    }

    const patientCode = `P-${String(nextNumber).padStart(3, "0")}`;
    const patient = await Patient.create({
      ...body,
      patientCode,
      userId: req.userId,
    });

    return res.status(201).json(patient);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { isArchived, patientCode, ...safeBody } = req.body;

    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: safeBody },
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

export const archivePatient = async (req: Request, res: Response) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unarchivePatient = async (req: Request, res: Response) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
