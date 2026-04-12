import { Outlet, useNavigate } from "react-router-dom";
import { useThemeStore } from "../hooks/useThemeStore";

export default function Header() {
    const navigate = useNavigate();
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <>
            <div className="h-16 flex items-center justify-between px-6 bg-gray-800 dark:bg-gray-900 text-white sticky top-0 z-50">

                <a href="/" className="text-xl font-semibold">
                    Reaper’s Log
                </a>

                <div className="flex items-center gap-3">
                    {/* New Patient */}
                    <button
                        onClick={() => navigate("/patient/new")}
                        className="px-4 py-2 bg-blue-700 rounded-lg hover:opacity-90"
                    >
                        <span className="font-bold">+</span> New Patient
                    </button>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}

                        className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>
            </div>

            <Outlet />
        </>
    );
}