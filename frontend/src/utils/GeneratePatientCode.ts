export default function generatePatientCode(
  patients: { patientCode?: string }[],
): string {
  if (patients.length === 0) return "P001";

  const numbers = patients
    .map((p) => p.patientCode)
    .filter(Boolean)
    .map((code) => parseInt(code!.replace("P", "")))
    .sort((a, b) => b - a);

  const next = (numbers[0] || 0) + 1;

  return `P${String(next).padStart(3, "0")}`;
}
