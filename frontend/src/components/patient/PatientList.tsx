import type { Patient } from "../types/patient";
import PatientCard from "./PatientCard";

export default function PatientList() {
    const patients = [
        {
            id: "P001",
            fullName: "John Doe",
            admissionType: ["Orthopedic", "Other"] as const,
            admissionTypeOther: "Custom reason",
        },
        {
            id: "P002",
            fullName: "Jane Smith",
            admissionType: ["Pulmonary"] as const,
        },
        {
            id: "P003",
            fullName: "Bob Johnson",
            admissionType: ["Neurologic", "Other"] as const,
            admissionTypeOther: "Special case",
        },
    ] as Pick<Patient, 'id' | 'fullName' | 'admissionType' | 'admissionTypeOther'>[];

    return (
        <div className="overflow-hidden ">
            {/* Header Row */}
            <div className="hidden sm:flex items-center gap-4 p-4 text-sm font-semibold border-b border-gray-800">
                <p className="w-20 shrink-0">ID</p>
                <p className="w-32">Name</p>
                <p>Admission Type</p>
            </div>

            {/* Patient Cards */}
            <div className="flex flex-col">
                {patients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}
            </div>
        </div>
    );
}