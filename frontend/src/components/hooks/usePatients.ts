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
      if (patient._id) {
        // UPDATE
        const updated = await updatePatient(patient._id, patient);

        set((state) => ({
          patients: state.patients.map((p) =>
            p._id === patient._id ? updated : p,
          ),
          currentPatient: updated,
        }));
      } else {
        //  CREATE
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
      patients: state.patients.filter((p) => p._id !== id),
      currentPatient:
        state.currentPatient?._id === id ? null : state.currentPatient,
    }));
  },
}));
