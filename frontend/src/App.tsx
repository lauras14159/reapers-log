import PatientForm from "./components/patient/PatientForm";
import AppRouter from "./router/AppRouter";

function App() {
  return <div className="bg-[#FAF9F6] min-h-screen">
    <AppRouter />
    <PatientForm />
  </div>;
}

export default App;