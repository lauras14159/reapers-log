import { Outlet } from "react-router-dom";
import { useThemeStore } from "../hooks/useThemeStore";
import Sidebar from "./Sidebar";

export default function Header() {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-16 flex items-center justify-between pl-16 pr-6 md:px-6 bg-gray-800 dark:bg-gray-900 text-white sticky top-0 z-50">
                <a href="/" className="text-xl font-semibold">
                    Reaper’s Log
                </a>

                <button
                    onClick={toggleTheme}
                    className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
            </div>

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}