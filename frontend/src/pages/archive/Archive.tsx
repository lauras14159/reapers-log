import { usePatientStore } from "../../components/hooks/usePatients";
import PatientCard from "../../components/patient/PatientCard";

export default function ArchiveList() {
    const { patients } = usePatientStore();

    const archivedPatients = patients.filter((p) => p.isArchived);

    return (
        <div className="flex flex-col">
            {archivedPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
            ))}
        </div>
    );
}