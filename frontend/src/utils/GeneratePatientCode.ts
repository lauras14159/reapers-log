export default function generatePatientCode(
  patients: { patientCode?: string }[],
): string {
  if (patients.length === 0) return "P001";

  const numbers = patients
    .map((p) => p.patientCode)
    .filter(Boolean)
    .map((code) => Number(code!.replace("P", "")));

  const max = Math.max(...numbers);

  return `P${String(max + 1).padStart(3, "0")}`;
}
