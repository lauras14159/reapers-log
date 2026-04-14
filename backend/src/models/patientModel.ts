import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  id: string;
  patientCode: string;
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
    algoPlusScale: string | null;
    algoPlusScore: number;
  };

  period?: string;

  musculoskeletal?: {
    rangeOfMotion: Array<"Right" | "Left">;
    upperLimbsROM?: { shoulder?: string; elbow?: string; wrist?: string };
    lowerLimbsROM?: { hip?: string; knee?: string; ankle?: string };
    spineROM?: { cervical?: string; lumbar?: string };
  };

  motorTesting?: {
    rightDates: string[];
    leftDates: string[];
    rows: { name: string; right: string[]; left: string[] }[];
  };

  functionalField?: {
    dateFunctionalField: [string];
    sitting: [Number];
    standing: [Number];
    usingLivingAid: [Number];
    goingToRestroom: [Number];
    stairs: [Number];
    puttingShoesOrSocks: [Number];
    walking10Meters: [Number];
    total: [string];
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
  age: { type: Number, required: false },
  dateOfBirth: { type: String, required: false },
  sex: { type: String, enum: ["Male", "Female"], required: false },

  indications: { type: String, default: "" },
  contraindications: { type: String, default: "" },
  precautions: { type: String, default: "" },
  history: { type: String, default: "" },

  patientCode: { type: String, required: false, unique: true },

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
});

export default mongoose.model<IPatient>("Patient", patientSchema);
