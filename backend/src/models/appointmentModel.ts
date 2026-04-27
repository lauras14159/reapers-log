import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  linkedPatientId?: mongoose.Types.ObjectId; // for follow-up appointments
  patientName: string;
  date: string;
  time: string;
  notes?: string;
  status: "upcoming" | "done" | "cancelled";
  reminderTime?: string;
  reminderSent: boolean;
  patientCreated: boolean;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    linkedPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    patientName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["upcoming", "done", "cancelled"],
      default: "upcoming",
    },
    reminderTime: { type: String },
    reminderSent: { type: Boolean, default: false },
    patientCreated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
