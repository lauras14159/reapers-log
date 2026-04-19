"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unarchivePatient = exports.archivePatient = exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatients = void 0;
const patientModel_1 = __importDefault(require("../models/patientModel"));
const getPatients = async (req, res) => {
    try {
        const patients = await patientModel_1.default.find({ userId: req.userId });
        res.json(patients);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getPatients = getPatients;
const createPatient = async (req, res) => {
    try {
        const { patientCode: _, ...body } = req.body;
        const lastPatient = await patientModel_1.default.findOne({ userId: req.userId })
            .sort({ _id: -1 })
            .select("patientCode");
        let nextNumber = 1;
        if (lastPatient?.patientCode) {
            const match = lastPatient.patientCode.match(/\d+/);
            if (match)
                nextNumber = parseInt(match[0], 10) + 1;
        }
        const patientCode = `P-${String(nextNumber).padStart(3, "0")}`;
        const patient = await patientModel_1.default.create({
            ...body,
            patientCode,
            userId: req.userId,
        });
        return res.status(201).json(patient);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createPatient = createPatient;
const updatePatient = async (req, res) => {
    try {
        const { isArchived, patientCode, ...safeBody } = req.body;
        const updated = await patientModel_1.default.findByIdAndUpdate(req.params.id, { $set: safeBody }, { returnDocument: "after", runValidators: true });
        if (!updated) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePatient = updatePatient;
const deletePatient = async (req, res) => {
    try {
        const deleted = await patientModel_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json({ message: "Patient deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deletePatient = deletePatient;
const archivePatient = async (req, res) => {
    try {
        const updated = await patientModel_1.default.findByIdAndUpdate(req.params.id, { isArchived: true }, { returnDocument: "after" });
        if (!updated) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.archivePatient = archivePatient;
const unarchivePatient = async (req, res) => {
    try {
        const updated = await patientModel_1.default.findByIdAndUpdate(req.params.id, { isArchived: false }, { returnDocument: "after" });
        if (!updated) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.unarchivePatient = unarchivePatient;
