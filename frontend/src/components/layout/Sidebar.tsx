import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Archive,
    User,
    type LucideIcon,
} from "lucide-react";

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <>

            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg" >
                <Menu size={20} />
            </button>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`
             bg-gray-800 dark:bg-gray-900 text-white
            transition-all duration-300 shrink-0 z-50

             ${isCollapsed ? "md:w-20" : "md:w-64"}
             fixed top-0 left-0 h-screen w-64
             transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}

             md:sticky md:top-16 md:h-[calc(100vh-4rem)]
             md:translate-x-0 `}
            >
                <div className="hidden md:flex justify-end p-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 hover:bg-gray-700 rounded"
                    >
                        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                </div>

                <div className="md:hidden flex justify-end p-4">
                    <button onClick={() => setIsMobileOpen(false)}>
                        <X />
                    </button>
                </div>

                <nav className="flex flex-col gap-4 p-4">
                    <SidebarItem
                        to="/"
                        label="Dashboard"
                        icon={LayoutDashboard}
                        collapsed={isCollapsed}
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <SidebarItem
                        to="/archive"
                        label="Archive"
                        icon={Archive}
                        collapsed={isCollapsed}
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <SidebarItem
                        to="/profile"
                        label="Profile"
                        icon={User}
                        collapsed={isCollapsed}
                        onClick={() => setIsMobileOpen(false)}
                    />
                </nav>
            </aside>
        </>
    );
}

function SidebarItem({
    label,
    collapsed,
    to,
    icon: Icon,
    onClick,
}: {
    label: string;
    collapsed: boolean;
    to: string;
    icon: LucideIcon;
    onClick?: () => void;
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
            }
        >
            <Icon size={20} />

            {(!collapsed || window.innerWidth < 768) && <span>{label}</span>}
        </NavLink>
    );
}