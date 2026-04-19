import { Navigate } from "react-router-dom";
import { useAuthStore } from "../components/hooks/useAuthStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, initialized } = useAuthStore();

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}