import { useEffect, useMemo, useState } from "react";
import { usePatientStore } from "../../components/hooks/usePatients";
import PatientCard from "../../components/patient/PatientCard";
import PatientFilters from "../../components/patient/PatientFilters";

export default function ArchiveList() {
    const { patients, fetchPatients } = usePatientStore();

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("name");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(false);
        try {
            await fetchPatients();
        } catch (err) {
            console.error("Failed to load:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        if (mounted) load();
        return () => { mounted = false; };
    }, []);

    const filteredArchived = useMemo(() => {
        let result = patients.filter((p) => p.isArchived);

        if (search) {
            result = result.filter((p) =>
                p.fullName.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === "name") {
            result = [...result].sort((a, b) =>
                a.fullName.localeCompare(b.fullName)
            );
        } else {
            result = [...result].sort(
                (a, b) =>
                    new Date(a.firstSessionDate).getTime() -
                    new Date(b.firstSessionDate).getTime()
            );
        }

        return result;
    }, [patients, search, sortBy]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading archive...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-gray-500">Failed to load. The server may be waking up.</p>
                <button
                    onClick={load}
                    className="px-4 py-2 rounded border border-gray-800 hover:bg-gray-800 hover:text-white transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <PatientFilters
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <div className="hidden sm:flex items-center gap-4 p-4 text-sm font-semibold border-b border-gray-800 dark:border-white">
                <p className="w-20 shrink-0">ID</p>
                <p className="w-36">Name</p>
                <p className="w-40">First Session Date</p>
                <p>Admission Type</p>
            </div>


            <div className="flex flex-col">
                {filteredArchived.length === 0 ? (
                    <p className="text-center text-gray-500 p-6">
                        No archived patients
                    </p>
                ) : (
                    filteredArchived.map((patient) => (
                        <PatientCard
                            key={patient._id}
                            patient={patient}
                        />
                    ))
                )}
            </div>
        </div>
    );
}