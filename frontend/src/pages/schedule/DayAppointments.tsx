import { useAppointmentStore, type Appointment } from "../../components/hooks/useAppointmentStore";
import { usePatientStore } from "../../components/hooks/usePatients";

type Props = {
    date: string;
    appointments: Appointment[];
    onEdit: (appointment: Appointment) => void;
    onClose: () => void;
    onNewAppointment: () => void;
};

export default function DayAppointments({ date, appointments, onEdit, onClose, onNewAppointment }: Props) {
    const { removeAppointment, markDone, editAppointment } = useAppointmentStore();
    const { fetchPatients } = usePatientStore();

    const handleMarkDone = async (id: string) => {
        if (!confirm("Mark as done? This will create the patient in your list.")) return;
        await markDone(id);
        await fetchPatients(); // ✅ refresh patient list
    };

    const handleCancel = async (appointment: Appointment) => {
        if (!confirm("Cancel this appointment?")) return;
        await editAppointment(appointment._id, { status: "cancelled" });
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">{date}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                >
                    ×
                </button>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No appointments this day</p>
                    <button
                        onClick={onNewAppointment}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        + Add appointment
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {appointments.map((a) => (
                        <div
                            key={a._id}
                            className="border rounded-lg p-3 space-y-2"
                        >
                            {/* Status badge */}
                            <div className="flex justify-between items-start">
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === "done"
                                            ? "bg-green-100 text-green-700"
                                            : a.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {a.status}
                                </span>
                                <span className="text-sm font-medium">{a.time}</span>
                            </div>

                            <p className="font-semibold">{a.patientName}</p>
                            {a.notes && (
                                <p className="text-sm text-gray-500">{a.notes}</p>
                            )}

                            {/* Actions */}
                            {a.status === "upcoming" && (
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => handleMarkDone(a._id)}
                                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                                    >
                                        ✓ Done
                                    </button>
                                    <button
                                        onClick={() => onEdit(a)}
                                        className="text-xs border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleCancel(a)}
                                        className="text-xs border border-red-300 text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this appointment?")) {
                                                removeAppointment(a._id);
                                            }
                                        }}
                                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}