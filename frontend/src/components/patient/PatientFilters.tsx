import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "../../svg/arrowDown";

type Props = {
    search: string;
    onSearchChange: (value: string) => void;

    sortBy: "name" | "date";
    onSortChange: (value: "name" | "date") => void
};

export default function PatientFilters({
    search,
    onSearchChange,
    sortBy,
    onSortChange,
}: Props) {
    const navigate = useNavigate();

    return (
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <button
                onClick={() => navigate("/patient/new")}
                className="order-1 sm:order-2 px-4 py-2 bg-blue-700 rounded-lg hover:opacity-90 self-start sm:self-auto text-white w-full sm:w-auto"
            >
                <span className="font-bold">+</span> New Patient
            </button>

            {/* Filters */}
            <div className="order-2 sm:order-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onSearchChange(e.target.value)
                    }
                    className="px-3 py-2 w-full sm:w-64 border rounded"
                />

                {/* Sort */}
                <div className="relative w-full sm:w-auto">
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            onSortChange(e.target.value as "name" | "date")
                        }
                        className="px-3 py-2 pr-10 w-full border rounded appearance-none"
                    >
                        <option value="name" className="text-gray-900">Sort A → Z</option>
                        <option value="date" className="text-gray-900">Sort by First Session</option>
                    </select>

                    {/* Arrow */}
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        <ArrowDown
                            width={20}
                            className="text-gray-800 dark:text-white"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}