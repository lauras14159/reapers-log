import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Patient } from "../types/patient";

interface PatientStore {
  patients: Patient[];
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  savePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      patients: [],
      currentPatient: null,

      setCurrentPatient: (patient) => set({ currentPatient: patient }),

      savePatient: (patient) =>
        set((state) => {
          if (patient.id) {
            return {
              patients: state.patients.map((p) =>
                p.id === patient.id ? patient : p,
              ),
              currentPatient: patient,
            };
          } else {
            const newPatient = {
              ...patient,
              id: Date.now().toString(),
            };
            return {
              patients: [...state.patients, newPatient],
              currentPatient: newPatient,
            };
          }
        }),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
          currentPatient:
            state.currentPatient?.id === id ? null : state.currentPatient,
        })),
    }),
    {
      name: "patient-storage", // name of the item in storage
    },
  ),
);
