import { Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Dashboard from "../pages/dashboard/Dashboard";
import PatientNew from "../pages/patient/PatientNew";
import PatientDetail from "../pages/patient/PatientDetail";

const AppRouter = () => {
    return (

        <Routes>
            <Route element={<Header />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patient/new" element={<PatientNew />} />
                <Route path="/patient/:id" element={<PatientDetail />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;