import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Patient } from "../types/patient";

type PatientStore = {
  patients: Patient[];
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;
  savePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
};

function generatePatientCode(patients: { patientCode?: string }[]): string {
  if (patients.length === 0) return "P001";

  const numbers = patients
    .map((p) => p.patientCode)
    .filter(Boolean)
    .map((code) => parseInt(code!.replace("P", "")))
    .sort((a, b) => b - a);

  const next = (numbers[0] || 0) + 1;

  return `P${String(next).padStart(3, "0")}`;
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
            //  EDIT (keep same patientCode)
            return {
              patients: state.patients.map((p) =>
                p.id === patient.id ? patient : p,
              ),
              currentPatient: patient,
            };
          } else {
            //  CREATE (generate patientCode)
            const newPatient = {
              ...patient,
              id: Date.now().toString(),
              patientCode: generatePatientCode(state.patients),
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
