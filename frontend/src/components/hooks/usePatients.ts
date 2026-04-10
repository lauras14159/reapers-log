import { create } from "zustand";
import type { Patient } from "../types/patient";
import {
  getPatients,
  updatePatient,
  createPatient,
  deletePatient,
} from "../../api/patientApi";

type PatientStore = {
  patients: Patient[];
  currentPatient: Patient | null;

  setPatients: (patients: Patient[]) => void;
  setCurrentPatient: (patient: Patient | null) => void;

  fetchPatients: () => Promise<void>;
  savePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
};

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  currentPatient: null,

  setPatients: (patients) => set({ patients }),
  setCurrentPatient: (patient) => set({ currentPatient: patient }),

  // LOAD FROM DB
  fetchPatients: async () => {
    const data = await getPatients();
    set({ patients: data });
  },

  // CREATE / UPDATE
  savePatient: async (patient) => {
    try {
      if (patient.id) {
        const updated = await updatePatient(patient.id, patient);

        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === patient.id ? updated : p,
          ),
          currentPatient: updated,
        }));
      } else {
        const created = await createPatient(patient);

        set((state) => ({
          patients: [...state.patients, created],
          currentPatient: created,
        }));
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  },

  // DELETE
  deletePatient: async (id) => {
    await deletePatient(id);

    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      currentPatient:
        state.currentPatient?.id === id ? null : state.currentPatient,
    }));
  },
}));
