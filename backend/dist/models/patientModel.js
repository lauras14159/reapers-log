"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const patientSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    age: { type: Number, required: false },
    dateOfBirth: { type: String, required: false },
    sex: { type: String, enum: ["Male", "Female"], required: false },
    indications: { type: String, default: "" },
    contraindications: { type: String, default: "" },
    precautions: { type: String, default: "" },
    history: { type: String, default: "" },
    patientCode: { type: String, required: false, unique: false },
    dateOfAccident: { type: String },
    firstSessionDate: { type: String },
    time: { type: String },
    admissionType: { type: [String], default: [] },
    admissionTypeOther: String,
    riskFactors: { type: [String], default: [] },
    riskFactorsOther: String,
    gaitTraining: { type: [String], default: [] },
    livingAids: { type: [String], default: [] },
    brace: {
        braceField: String,
    },
    sittingPosition: { type: [String], default: [] },
    painScale: {
        numeric: Boolean,
        score: Number,
        painScaleRate: Number,
    },
    algoPlus: {
        algoChecked: { type: Boolean, default: false },
        algoPlusScale: {
            type: String,
            enum: [
                "Facial expressions",
                "Look",
                "Complaints",
                "Body position",
                "Atypical behavior",
            ],
            default: null,
        },
        algoPlusScore: { type: Number, default: 0 },
    },
    period: String,
    functionalField: {
        dateFunctionalField: { type: [String], default: [] },
        sitting: { type: [Number], default: [] },
        standing: { type: [Number], default: [] },
        usingLivingAid: { type: [Number], default: [] },
        goingToRestroom: { type: [Number], default: [] },
        stairs: { type: [Number], default: [] },
        puttingShoesOrSocks: { type: [Number], default: [] },
        walking10Meters: { type: [Number], default: [] },
        total: { type: [String], default: [] },
    },
    musculoskeletal: {
        rangeOfMotion: { type: [String], enum: ["Right", "Left"] },
        upperLimbsROM: {
            shoulder: String,
            elbow: String,
            wrist: String,
        },
        lowerLimbsROM: {
            hip: String,
            knee: String,
            ankle: String,
        },
        spineROM: {
            cervical: String,
            lumbar: String,
        },
    },
    motorTesting: {
        motorDates: { type: [String], default: [] },
        rightDates: { type: [String], default: [] },
        leftDates: { type: [String], default: [] },
        rows: [
            {
                name: String,
                right: { type: [String], default: [] },
                left: { type: [String], default: [] },
            },
        ],
    },
    respiratory: {
        breathType: { type: [String], default: [] },
        auscultation: { type: [String], default: [] },
        cough: { type: [String], default: [] },
        secretion: { type: [String], default: [] },
        secretionColor: { type: [String], default: [] },
    },
    treatmentPlan: {
        assessmentFindings: { type: [String], default: [] },
        goals: { type: [String], default: [] },
        prioritization: { type: [String], default: [] },
    },
    ptSchedule: [
        {
            weekNumber: Number,
            date: String,
            sessions: [
                {
                    sessionNumber: Number,
                    note: String,
                },
            ],
        },
    ],
    isArchived: { type: Boolean, default: false },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Patient", patientSchema, "patients");
