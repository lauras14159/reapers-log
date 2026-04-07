export type Patient = {
  id?: string;
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

  // Form fields
  gaitTraining?: GaitTraining;
  livingAids?: LivingAids;
  brace?: Brace;
  sittingPosition?: SittingPosition;
  painScale?: PainScale;
  algoPlus?: AlgoPlusScore;
  period?: string;

  // Optional assessments
  musculoskeletal?: MusculoskeletalEvaluation;
  motorTesting?: MotorTesting;
  respiratory?: RespiratoryTest;
  treatmentPlan?: TreatmentPlan;
};

export type UpperLimbsROM = {
  shoulder?: string;
  elbow?: string;
};
export type LowerLimbsROM = {
  hip?: string;
  knee?: string;
};
export type SpineROM = {
  cervical?: string;
  lumbar?: string;
};

export type MusculoskeletalEvaluation = {
  rangeOfMotion: Array<"Right" | "Left">;
  upperLimbsROM?: UpperLimbsROM;
  lowerLimbsROM?: LowerLimbsROM;
  spineROM?: SpineROM;
};

export type FunctionalAssessment = {
  patient: Patient;
  musculoskeletalEvaluation: MusculoskeletalEvaluation;
};

export type NumericScore = 0 | 1 | 2;

export type GaitTraining = Array<
  | "Full weight bearing"
  | "Inside the room"
  | "Partial weight bearing"
  | "Outside the room"
  | "Without weight bearing"
>;

export type LivingAids = Array<"Walker" | "Crutches" | "Stick" | "Brace">;
export type Brace = {
  braceField: string;
};

export type AlgoPlusScore = {
  algoChecked: boolean;
  algoPlusScore: number;
};

export type SittingPosition = Array<"Side of the bed" | "On Chair">;

export type PainScale = {
  numeric: boolean;
  score?: number;
  painScaleRate: number;
};

export type FunctionalField = {
  dateFunctionalField: string;
  sitting: NumericScore;
  standing: NumericScore;
  usingLivingAid: NumericScore;
  goingToRestroom: NumericScore;
  stairs: NumericScore; // going up/down stairs
  puttingShoesOrSocks: NumericScore;
  walking10Meters: NumericScore;
  total?: string;
  period: string;
  gaitTraining: GaitTraining;
  livingAids: LivingAids;
  brace?: Brace;
  algoPlusScore: AlgoPlusScore;
  sittingPosition: SittingPosition;
  painScale: PainScale;
};

export type MotorSide = string[];

export type MotorRow = {
  name: string;
  right: string[];
  left: string[];
};

export type MotorTesting = {
  motorDates: string[];
  rows: MotorRow[];
};

export type RespiratoryTest = {
  breathType: Array<"Abdominal" | "Thoracic" | "Superficial" | "Respirator">;
  auscultation: Array<"Wheezing" | "Crepitus" | "Snoring">;
  cough: Array<"Productive" | "Greasy" | "Dry">;
  secretion: Array<"No secretion" | "Expectorated" | "Aspirated" | "Swallowed">;
  secretionColor: Array<"Bloodshed" | "White" | "Yellow" | "Green">;
};

export type TreatmentPlan = {
  assessmentFindings: string[];
  goals: string[];
  prioritization: string[];
};
