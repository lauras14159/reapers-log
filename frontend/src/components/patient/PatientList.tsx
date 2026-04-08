import { useMemo, useState } from "react";
import type { Patient } from "../types/patient";
import PatientCard from "./PatientCard";
import PatientFilters from "./PatientFilters";

export default function PatientList() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("name");
    const [filterDate, setFilterDate] = useState("");

    const patients = [
        {
            id: "P001",
            fullName: "John Doe",
            firstSessionDate: "2024-01-10",
            admissionType: ["Orthopedic", "Other"] as const,
            admissionTypeOther: "Custom reason",
        },
        {
            id: "P002",
            fullName: "Jane Smith",
            firstSessionDate: "2024-02-15",
            admissionType: ["Pulmonary"] as const,
        },
        {
            id: "P003",
            fullName: "Bob Johnson",
            firstSessionDate: "2024-01-05",
            admissionType: ["Neurologic", "Other"] as const,
            admissionTypeOther: "Special case",
        },
    ] as Pick<
        Patient,
        "id" | "fullName" | "firstSessionDate" | "admissionType" | "admissionTypeOther"
    >[];

    const filteredPatients = useMemo(() => {
        let result = [...patients];

        // Search
        if (search) {
            result = result.filter((p) =>
                p.fullName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by date
        if (filterDate) {
            result = result.filter(
                (p) => p.firstSessionDate === filterDate
            );
        }

        // Sort
        if (sortBy === "name") {
            result.sort((a, b) =>
                a.fullName.localeCompare(b.fullName)
            );
        } else {
            result.sort(
                (a, b) =>
                    new Date(a.firstSessionDate).getTime() -
                    new Date(b.firstSessionDate).getTime()
            );
        }

        return result;
    }, [patients, search, sortBy, filterDate]);

    return (
        <div className="overflow-hidden">

            <PatientFilters
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterDate={filterDate}
                onFilterDateChange={setFilterDate}
            />

            {/* Header */}
            <div className="hidden sm:flex items-center gap-4 p-4 text-sm font-semibold border-b border-gray-800">
                <p className="w-20 shrink-0">ID</p>
                <p className="w-36">Name</p>
                <p className="w-40">First Session Date</p>
                <p>Admission Type</p>
            </div>

            {/* List */}
            <div className="flex flex-col">
                {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}
            </div>
        </div>
    );
}