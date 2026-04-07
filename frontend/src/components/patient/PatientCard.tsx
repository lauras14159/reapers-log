import type { Patient } from '../types/patient';
import { usePatientStore } from '../hooks/usePatients';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PatientCardProps = {
    patient: Pick<Patient, 'id' | 'fullName' | 'admissionType' | 'admissionTypeOther'>;
};

export default function PatientCard({ patient }: PatientCardProps) {
    const { deletePatient, setCurrentPatient } = usePatientStore();
    const navigate = useNavigate();
    const handleView = () => {
        setCurrentPatient(patient as Patient);
        navigate(`/patient/${patient.id}`);
    };

    return (
        <div className="flex flex-row sm:items-center sm:justify-between justify-center py-2 px-4 border-b border-gray-800 text-sm gap-2 sm:gap-4">
            {/* Patient Info */}
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 flex-1 ">
                <p className="w-20 shrink-0">{patient.id}</p>
                <h3 className="font-medium w-32">{patient.fullName}</h3>
                <p>
                    {patient.admissionType.join(', ')}
                    {patient.admissionType.includes("Other") && patient.admissionTypeOther
                        ? `: ${patient.admissionTypeOther}`
                        : ''}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0 justify-end py-5 md:py-2">
                <button
                    onClick={() => handleView()}
                    className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-800 font-medium cursor-pointer"
                >
                    View
                </button>

                <button
                    onClick={() => deletePatient(patient.id!)}
                    className="flex items-center justify-center w-9 h-9 text-red-600 cursor-pointer"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}