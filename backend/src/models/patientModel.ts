import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  age: number;
  dateOfBirth: string;
  sex: "Male" | "Female";
  dateOfAccident: string;
  firstSessionDate: string;
  time: string;

  admissionType: Array<"Orthopedic" | "Pulmonary" | "Neurologic" | "Other">;
  admissionTypeOther?: string;

  riskFactors: Array<"Smoking" | "Overweight" | "Other">;
  riskFactorsOther?: string;

  indications: string;
  contraindications: string;
  precautions: string;

  history: string;

  gaitTraining?: string[];
  livingAids?: string[];
  brace?: { braceField: string };
  sittingPosition?: string[];
  painScale?: { numeric: boolean; score?: number; painScaleRate: number };

  algoPlus?: {
    algoChecked: boolean;
    algoPlusScore: number;
    algoPlusScale: string[];
  };

  period?: string;

  musculoskeletal?: {
    rangeOfMotion: Array<"Right" | "Left">;
    upperLimbsROM?: { shoulder?: string; elbow?: string; wrist?: string };
    lowerLimbsROM?: { hip?: string; knee?: string; ankle?: string };
    spineROM?: { cervical?: string; lumbar?: string };
  };

  motorTesting?: {
    motorDates: string[];
    rows: { name: string; right: string[]; left: string[] }[];
  };

  functionalField?: {
    dateFunctionalField: string[];
    sitting: Number;
    standing: Number;
    usingLivingAid: Number;
    goingToRestroom: Number;
    stairs: Number;
    puttingShoesOrSocks: Number;
    walking10Meters: Number;
    total: String;
  };

  respiratory?: {
    breathType: string[];
    auscultation: string[];
    cough: string[];
    secretion: string[];
    secretionColor: string[];
  };

  treatmentPlan?: {
    assessmentFindings: string[];
    goals: string[];
    prioritization: string[];
  };

  ptSchedule?: {
    weekNumber: number;
    date?: string;
    sessions: {
      sessionNumber: number;
      note: string;
    }[];
  }[];
}

const patientSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: String, required: true },
  sex: { type: String, enum: ["Male", "Female"], required: true },

  dateOfAccident: { type: String, required: true },
  firstSessionDate: { type: String, required: true },
  time: { type: String, required: true },

  admissionType: {
    type: [String],
    enum: ["Orthopedic", "Pulmonary", "Neurologic", "Other"],
    required: true,
  },
  admissionTypeOther: String,

  riskFactors: {
    type: [String],
    enum: ["Smoking", "Overweight", "Other"],
    required: true,
  },
  riskFactorsOther: String,

  indications: { type: String, required: true },
  contraindications: { type: String, required: true },
  precautions: { type: String, required: true },

  history: { type: String, required: true },

  gaitTraining: [String],
  livingAids: [String],

  brace: {
    braceField: String,
  },

  sittingPosition: [String],

  painScale: {
    numeric: Boolean,
    score: Number,
    painScaleRate: Number,
  },

  algoPlus: {
    algoChecked: Boolean,
    algoPlusScore: Number,
    algoPlusScale: [String],
  },

  period: String,

  functionalField: {
    dateFunctionalField: [String],
    sitting: { type: Number },
    standing: { type: Number },
    usingLivingAid: { type: Number },
    goingToRestroom: { type: Number },
    stairs: { type: Number },
    puttingShoesOrSocks: { type: Number },
    walking10Meters: { type: Number },
    total: { type: String },
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
    motorDates: [String],
    rows: [
      {
        name: String,
        right: [String],
        left: [String],
      },
    ],
  },

  respiratory: {
    breathType: [String],
    auscultation: [String],
    cough: [String],
    secretion: [String],
    secretionColor: [String],
  },

  treatmentPlan: {
    assessmentFindings: [String],
    goals: [String],
    prioritization: [String],
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
});

export default mongoose.model<IPatient>("Patient", patientSchema);
