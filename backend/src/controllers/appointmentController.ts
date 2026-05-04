import { Request, Response } from "express";
import Appointment from "../models/appointmentModel";
import Patient from "../models/patientModel";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/userModel";
import { Resend } from "resend";

// GET all appointments for user
export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ userId: req.userId });
    res.json(appointments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE appointment — accept linkedPatientId
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { patientName, date, time, notes, reminderTime, linkedPatientId } =
      req.body;

    const appointment = await Appointment.create({
      userId: req.userId,
      linkedPatientId: linkedPatientId || null, //
      patientName,
      date,
      time,
      notes,
      reminderTime,
    });

    res.status(201).json(appointment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// MARK AS DONE — smart ptSchedule logic
export const markAsDone = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "done";
    appointment.patientCreated = true;
    await appointment.save();

    let patient;

    // ── FOLLOW-UP: linked to existing patient ──────────────
    if (appointment.linkedPatientId) {
      patient = await Patient.findById(appointment.linkedPatientId);

      if (patient) {
        const ptSchedule = patient.ptSchedule || [];
        const appointmentDate = new Date(appointment.date);

        // check if appointment fits in an existing week (within 7 days)
        let addedToExistingWeek = false;

        for (const week of ptSchedule) {
          if (!week.date) continue;
          const weekDate = new Date(week.date);
          const diffDays = Math.abs(
            (appointmentDate.getTime() - weekDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          if (diffDays <= 7) {
            //  same week — add new session
            week.sessions.push({
              sessionNumber: week.sessions.length + 1,
              note: "",
            });
            addedToExistingWeek = true;
            break;
          }
        }

        if (!addedToExistingWeek) {
          //  different week — add new week
          ptSchedule.push({
            weekNumber: ptSchedule.length + 1,
            date: appointment.date,
            sessions: [{ sessionNumber: 1, note: "" }],
          });
        }

        patient.ptSchedule = ptSchedule;
        await patient.save();
      }
    }

    // ── NEW PATIENT ─────────────────────────────────────────
    else {
      const lastPatient = await Patient.findOne({ userId: req.userId })
        .sort({ _id: -1 })
        .select("patientCode");

      let nextNumber = 1;
      if (lastPatient?.patientCode) {
        const match = lastPatient.patientCode.match(/\d+/);
        if (match) nextNumber = parseInt(match[0], 10) + 1;
      }

      const patientCode = `P-${String(nextNumber).padStart(3, "0")}`;

      patient = await Patient.create({
        userId: req.userId,
        fullName: appointment.patientName,
        firstSessionDate: appointment.date,
        time: appointment.time,
        patientCode,
        //  prefill week 1 with the appointment date
        ptSchedule: [
          {
            weekNumber: 1,
            date: appointment.date,
            sessions: [{ sessionNumber: 1, note: "" }],
          },
        ],
      });
    }

    res.json({ appointment, patient });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE appointment
export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { returnDocument: "after" },
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE appointment
export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    await Appointment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: "Appointment deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// SEND REMINDERS — called by cron job every 5 minutes
export const sendReminders = async () => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // compare in UTC — frontend saves reminderTime as UTC
    const nowUTC = new Date().toISOString().slice(0, 16);

    const upcoming = await Appointment.find({
      status: "upcoming",
      reminderSent: false,
      reminderTime: { $lte: nowUTC },
    });

    for (const appointment of upcoming) {
      try {
        const user = await User.findById(appointment.userId);

        if (!user?.email) {
          console.log("❌ No email for userId:", appointment.userId);
          continue;
        }

        console.log(`📧 Sending reminder to: ${user.email}`);

        await resend.emails.send({
          from: "Physio App <onboarding@resend.dev>",
          to: user.email,
          subject: `🏥 Reminder: Appointment with ${appointment.patientName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e2939;">Appointment Reminder 📅</h2>
              <hr/>
              <p><strong>Patient:</strong> ${appointment.patientName}</p>
              <p><strong>Date:</strong> ${appointment.date}</p>
              <p><strong>Time:</strong> ${appointment.time}</p>
              ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ""}
              <hr/>
              <p style="color: gray; font-size: 12px;">Sent by your Physio App</p>
            </div>
          `,
        });

        console.log(` Email sent to: ${user.email}`);
        appointment.reminderSent = true;
        await appointment.save();
      } catch (emailErr) {
        console.error("❌ Resend error:", emailErr);
      }
    }
  } catch (err) {
    console.error("❌ sendReminders error:", err);
  }
};
