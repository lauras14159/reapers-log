import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  age: number;
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

  gaitTraining?: Array<
    | "Full weight bearing"
    | "Inside the room"
    | "Partial weight bearing"
    | "Outside the room"
    | "Without weight bearing"
  >;

  livingAids?: Array<"Walker" | "Crutches" | "Stick" | "Brace">;
  brace?: { braceField: string };
  sittingPosition?: Array<"Side of the bed" | "On Chair">;
  painScale?: { numeric: boolean; score?: number; painScaleRate: number };
  algoPlus?: { algoChecked: boolean; algoPlusScore: number };
  period?: string;

  musculoskeletal?: {
    rangeOfMotion: Array<"Right" | "Left">;
    upperLimbsROM?: { shoulder?: string; elbow?: string };
    lowerLimbsROM?: { hip?: string; knee?: string };
    spineROM?: { cervical?: string; lumbar?: string };
  };

  motorTesting?: {
    motorDates: string[];
    rows: { name: string; right: string[]; left: string[] }[];
  };

  respiratory?: {
    breathType: Array<"Abdominal" | "Thoracic" | "Superficial" | "Respirator">;
    auscultation: Array<"Wheezing" | "Crepitus" | "Snoring">;
    cough: Array<"Productive" | "Greasy" | "Dry">;
    secretion: Array<
      "No secretion" | "Expectorated" | "Aspirated" | "Swallowed"
    >;
    secretionColor: Array<"Bloodshed" | "White" | "Yellow" | "Green">;
  };

  treatmentPlan?: {
    assessmentFindings: string[];
    goals: string[];
    prioritization: string[];
  };
}

const patientSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ["Male", "Female"], required: true },
  dateOfAccident: { type: String, required: true },
  firstSessionDate: { type: String, required: true },
  time: { type: String, required: true },

  admissionType: {
    type: [String],
    enum: ["Orthopedic", "Pulmonary", "Neurologic", "Other"],
    required: true,
  },
  admissionTypeOther: { type: String },

  riskFactors: {
    type: [String],
    enum: ["Smoking", "Overweight", "Other"],
    required: true,
  },
  riskFactorsOther: { type: String },

  indications: { type: String, required: true },
  contraindications: { type: String, required: true },
  precautions: { type: String, required: true },

  gaitTraining: {
    type: [String],
    enum: [
      "Full weight bearing",
      "Inside the room",
      "Partial weight bearing",
      "Outside the room",
      "Without weight bearing",
    ],
  },

  livingAids: {
    type: [String],
    enum: ["Walker", "Crutches", "Stick", "Brace"],
  },
  brace: { braceField: { type: String } },
  sittingPosition: { type: [String], enum: ["Side of the bed", "On Chair"] },
  painScale: {
    numeric: Boolean,
    score: Number,
    painScaleRate: { type: Number, required: true },
  },
  algoPlus: { algoChecked: Boolean, algoPlusScore: Number },
  period: { type: String },

  musculoskeletal: {
    rangeOfMotion: { type: [String], enum: ["Right", "Left"] },
    upperLimbsROM: { shoulder: String, elbow: String },
    lowerLimbsROM: { hip: String, knee: String },
    spineROM: { cervical: String, lumbar: String },
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
    breathType: {
      type: [String],
      enum: ["Abdominal", "Thoracic", "Superficial", "Respirator"],
    },
    auscultation: { type: [String], enum: ["Wheezing", "Crepitus", "Snoring"] },
    cough: { type: [String], enum: ["Productive", "Greasy", "Dry"] },
    secretion: {
      type: [String],
      enum: ["No secretion", "Expectorated", "Aspirated", "Swallowed"],
    },
    secretionColor: {
      type: [String],
      enum: ["Bloodshed", "White", "Yellow", "Green"],
    },
  },

  treatmentPlan: {
    assessmentFindings: [String],
    goals: [String],
    prioritization: [String],
  },
});

export default mongoose.model<IPatient>("Patient", patientSchema);
