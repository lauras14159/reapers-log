import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  fullName: string;
  age: number;
  sex: "Male" | "Female";
  dateOfAccident: string;
  firstSessionDate: string;
}

const patientSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ["Male", "Female"], required: true },
  dateOfAccident: { type: String, required: true },
  firstSessionDate: { type: String, required: true },
});

export default mongoose.model<IPatient>("Patient", patientSchema);
