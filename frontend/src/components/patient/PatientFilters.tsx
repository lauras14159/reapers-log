import type { ChangeEvent } from "react";
import { ArrowDown } from "../../svg/arrowDown";

type Props = {
    search: string;
    onSearchChange: (value: string) => void;

    sortBy: "name" | "date";
    onSortChange: (value: "name" | "date") => void;

    filterDate: string;
    onFilterDateChange: (value: string) => void;
};

export default function PatientFilters({
    search,
    onSearchChange,
    sortBy,
    onSortChange,
    filterDate,
    onFilterDateChange,
}: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">

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
                    className="px-3 py-2 pr-10 w-full border rounded appearance-none bg-white"
                >
                    <option value="name">Sort A → Z</option>
                    <option value="date">Sort by First Session</option>
                </select>

                {/* Custom Arrow */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">

                    <ArrowDown width={18} fill="black" />
                </span>
            </div>

            {/* Filter by Date */}
            <input
                type="date"
                value={filterDate}
                onChange={(e) => onFilterDateChange(e.target.value)}
                className="px-3 py-2 border rounded"
            />
        </div>
    );
}