import type { Patient } from '../types/patient';
import { usePatientStore } from '../hooks/usePatients';
import { useNavigate } from 'react-router-dom';
import { Bin } from '../../svg/bin';
import { Archive } from "lucide-react";


type PatientCardProps = {
    patient: Pick<Patient, '_id' | 'patientCode' | 'fullName' | 'firstSessionDate' | 'admissionType' | 'admissionTypeOther' | 'isArchived'>;
}

export default function PatientCard({ patient }: PatientCardProps) {
    const { deletePatient, setCurrentPatient } = usePatientStore();
    const navigate = useNavigate();
    const handleView = () => {
        setCurrentPatient(patient as Patient);
        navigate(`/patient/${patient._id}`);
    };
    const { archivePatient } = usePatientStore();

    return (
        <div className="flex flex-row sm:items-center sm:justify-between justify-center py-5 md:py-2 px-4 text-sm gap-2 sm:gap-4 border-b border-gray-800 dark:border-white">
            {/* Patient Info */}
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 flex-1 ">
                <p className="w-20 shrink-0">{patient.patientCode || "—"}</p>
                <h3 className="font-medium w-36">{patient.fullName}</h3>
                <p className='w-40'>{patient.firstSessionDate}</p>
                <p>
                    {(patient.admissionType || []).join(', ')}
                    {patient.admissionType?.includes("Other") && patient.admissionTypeOther
                        ? `: ${patient.admissionTypeOther}`
                        : ''}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-x-3 shrink-0 justify-end items-center">
                <button
                    onClick={() => handleView()}
                    className="flex items-center gap-1 px-3 h-10 rounded-md border border-gray-800 font-medium leading-none cursor-pointer hover:bg-gray-800 hover:text-white transition dark:border-white dark:hover:bg-white dark:hover:text-gray-800"
                >
                    View
                </button>

                <button
                    onClick={() => {
                        if (patient._id && confirm("Delete this patient?")) {
                            deletePatient(patient._id);
                        }
                    }}
                    className="flex items-center justify-center h-10 w-10 cursor-pointer"
                >
                    <Bin width={20} fill="#f70000" />
                </button>


                {patient.isArchived ? (
                    <span className="text-xs text-gray-400">Archived</span>
                ) : (
                    <button
                        onClick={() => {
                            if (!patient._id) return;
                            archivePatient(patient._id);
                        }}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                        <Archive size={18} />
                    </button>
                )}

            </div>
        </div>
    );
}