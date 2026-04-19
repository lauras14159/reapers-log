"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientController_1 = require("../controllers/patientController");
const router = express_1.default.Router();
router.get("/", patientController_1.getPatients);
router.post("/", patientController_1.createPatient);
router.put("/:id", patientController_1.updatePatient);
router.delete("/:id", patientController_1.deletePatient);
router.patch("/:id/archive", patientController_1.archivePatient);
router.patch("/:id/unarchive", patientController_1.unarchivePatient);
exports.default = router;
