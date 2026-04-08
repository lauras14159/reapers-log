import type { Patient } from '../types/patient';
import { usePatientStore } from '../hooks/usePatients';
import { useNavigate } from 'react-router-dom';
import { Bin } from '../../svg/bin';

type PatientCardProps = {
    patient: Pick<Patient, 'id' | 'fullName' | 'firstSessionDate' | 'admissionType' | 'admissionTypeOther'>;
};

export default function PatientCard({ patient }: PatientCardProps) {
    const { deletePatient, setCurrentPatient } = usePatientStore();
    const navigate = useNavigate();
    const handleView = () => {
        setCurrentPatient(patient as Patient);
        navigate(`/patient/${patient.id}`);
    };

    return (
        <div className="flex flex-row sm:items-center sm:justify-between justify-center py-5 md:py-2 px-4 border-b border-gray-800 text-sm gap-2 sm:gap-4">
            {/* Patient Info */}
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 flex-1 ">
                <p className="w-20 shrink-0">{patient.id}</p>
                <h3 className="font-medium w-36">{patient.fullName}</h3>
                <p className='w-40'>{patient.firstSessionDate}</p>
                <p>
                    {patient.admissionType.join(', ')}
                    {patient.admissionType.includes("Other") && patient.admissionTypeOther
                        ? `: ${patient.admissionTypeOther}`
                        : ''}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-x-3 shrink-0 justify-end items-center">
                <button
                    onClick={() => handleView()}
                    className="flex items-center gap-1 px-3 h-10 rounded-md border border-gray-800 font-medium leading-none cursor-pointer hover:bg-gray-800 hover:text-white transition"
                >
                    View
                </button>

                <button
                    onClick={() => deletePatient(patient.id!)}
                    className="flex items-center justify-center h-10 w-10 cursor-pointer"
                >
                    <Bin width={20} fill="#D2042D" />
                </button>
            </div>
        </div>
    );
}