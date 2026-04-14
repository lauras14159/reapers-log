import { Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Dashboard from "../pages/dashboard/Dashboard";
import PatientForm from "../components/patient/PatientForm";
import Archive from "../pages/archive/Archive";
import Profile from "../pages/profile/Profile";


const AppRouter = () => {
    return (
        <Routes>
            <Route element={<Header />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/patient/new" element={<PatientForm />} />
                <Route path="/patient/:id" element={<PatientForm />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;