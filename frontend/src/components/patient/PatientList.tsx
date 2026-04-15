import { useEffect, useMemo, useState } from "react";
import PatientCard from "./PatientCard";
import PatientFilters from "./PatientFilters";
import { usePatientStore } from "../hooks/usePatients";

export default function PatientList() {
    const { patients, fetchPatients } = usePatientStore();

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("name");
    const [filterDate] = useState("");//setFilterDate

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

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="overflow-hidden">

            <PatientFilters
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            {/* Header */}
            <div className="hidden sm:flex items-center gap-4 p-4 text-sm font-semibold border-b border-gray-800 dark:border-white">
                <p className="w-20 shrink-0">ID</p>
                <p className="w-36">Name</p>
                <p className="w-40">First Session Date</p>
                <p>Admission Type</p>
            </div>

            {/* List */}
            <div className="flex flex-col">
                {filteredPatients.map((patient) => (
                    <PatientCard key={patient._id} patient={patient} />
                ))}
            </div>
        </div>
    );
}