import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <><div className="h-16 flex items-center justify-between px-6 border-b bg-[#FFFDD0] dark:bg-gray-800  text-white">
            <h1 className="text-xl font-semibold">
                Reaper’s Log
            </h1>

            <button
                onClick={() => navigate("/patient/new")}
                className="px-4 py-2 bg-blue-700 rounded-lg hover:opacity-90"
            >
                + New Patient
            </button>
        </div>
        </>
    );
};