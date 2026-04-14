export type Patient = {
  _id: any;
  id?: string; // internal (mongo _id later)
  patientCode: string; // P001 (UI only)
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

  // Schedule of PT sessions
  ptSchedule?: PTSchedule;

  //FunctionalField
  functionalField?: FunctionalField;
};

export type UpperLimbsROM = {
  shoulder?: string;
  elbow?: string;
  wrist?: string;
};
export type LowerLimbsROM = {
  hip?: string;
  knee?: string;
  ankle?: string;
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

export type SittingPosition = Array<"Side of the bed" | "On Chair">;

export type AlgoPlusScale =
  | "Facial expressions"
  | "Look"
  | "Complaints"
  | "Body position"
  | "Atypical behavior"
  | null;

export type AlgoPlusScore = {
  algoChecked: boolean;
  algoPlusScale: AlgoPlusScale;
  algoPlusScore: number;
};

export type PainScale = {
  numeric: boolean;
  painScaleRate: number;
};

export type FunctionalField = {
  dateFunctionalField: string[];
  sitting: number[];
  standing: number[];
  usingLivingAid: number[];
  goingToRestroom: number[];
  stairs: number[];
  puttingShoesOrSocks: number[];
  walking10Meters: number[];
  total?: string[];
};

export type MotorRow = {
  name: string;
  right: string[];
  left: string[];
};

export type MotorTesting = {
  rightDates: string[];
  leftDates: string[];
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

// A single PT session with just a note
export type PTSession = {
  sessionNumber: number;
  note: string;
};

// A single week with multiple sessions
export type PTWeek = {
  weekNumber: number;
  date?: string;
  sessions: PTSession[];
};

export type PTSchedule = PTWeek[];
