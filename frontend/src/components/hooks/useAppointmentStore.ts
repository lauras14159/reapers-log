import { create } from "zustand";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  markAsDoneApi,
} from "../../api/appointmentApi";

export type Appointment = {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  notes?: string;
  status: "upcoming" | "done" | "cancelled";
  reminderTime?: string;
  reminderSent: boolean;
  patientCreated: boolean;
};

type AppointmentStore = {
  appointments: Appointment[];
  fetchAppointments: () => Promise<void>;
  addAppointment: (data: Partial<Appointment>) => Promise<void>;
  editAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;
  markDone: (id: string) => Promise<void>;
};

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],

  fetchAppointments: async () => {
    const data = await getAppointments();
    set({ appointments: data });
  },

  addAppointment: async (data) => {
    const created = await createAppointment(data);
    set({ appointments: [...get().appointments, created] });
  },

  editAppointment: async (id, data) => {
    const updated = await updateAppointment(id, data);
    set({
      appointments: get().appointments.map((a) => (a._id === id ? updated : a)),
    });
  },

  removeAppointment: async (id) => {
    await deleteAppointment(id);
    set({ appointments: get().appointments.filter((a) => a._id !== id) });
  },

  markDone: async (id) => {
    const { appointment, patient } = await markAsDoneApi(id);
    set({
      appointments: get().appointments.map((a) =>
        a._id === id ? appointment : a,
      ),
    });
    return patient;
  },
}));
