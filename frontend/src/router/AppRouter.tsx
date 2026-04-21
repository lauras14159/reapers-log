import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Dashboard from "../pages/dashboard/Dashboard";
import PatientForm from "../components/patient/PatientForm";
import Archive from "../pages/archive/Archive";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../components/hooks/useAuthStore";
import { useEffect } from "react";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Schedule from "../pages/schedule/Schedule";

const AppRouter = () => {
    const { fetchMe } = useAuthStore();

    useEffect(() => {
        fetchMe(); //  check if user is already logged in on app load
    }, []);

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route element={
                <ProtectedRoute>
                    <Header />
                </ProtectedRoute>
            }>
                <Route path="/" element={<Dashboard />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/patient/new" element={<PatientForm />} />
                <Route path="/patient/:id" element={<PatientForm />} />
                <Route path="/schedule" element={<Schedule />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;