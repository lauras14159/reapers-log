import { useState } from "react";
import { useAppointmentStore, type Appointment } from "../../components/hooks/useAppointmentStore";
import { usePatientStore } from "../../components/hooks/usePatients";

type Props = {
    defaultDate: string;
    appointment: Appointment | null;
    onClose: () => void;
};

const toLocalDatetime = (utcString: string) => {
    if (!utcString) return "";
    const date = new Date(utcString + "Z");
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function AppointmentModal({ defaultDate, appointment, onClose }: Props) {
    const { addAppointment, editAppointment } = useAppointmentStore();
    const { patients } = usePatientStore(); //  get patients list
    const isEdit = !!appointment;

    const [patientName, setPatientName] = useState(appointment?.patientName || "");
    const [linkedPatientId, setLinkedPatientId] = useState(
        (appointment as any)?.linkedPatientId || ""
    );
    const [date, setDate] = useState(appointment?.date || defaultDate);
    const [time, setTime] = useState(appointment?.time || "");
    const [notes, setNotes] = useState(appointment?.notes || "");
    const [reminderTime, setReminderTime] = useState(
        appointment?.reminderTime ? toLocalDatetime(appointment.reminderTime) : ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //  when picking existing patient, autofill the name
    const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setLinkedPatientId(selectedId);
        if (selectedId) {
            const found = patients.find(p => p._id === selectedId);
            if (found) setPatientName(found.fullName);
        } else {
            setPatientName("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const reminderUTC = reminderTime
                ? new Date(reminderTime).toISOString().slice(0, 16)
                : "";

            const data = {
                patientName,
                date,
                time,
                notes,
                reminderTime: reminderUTC,
                linkedPatientId: linkedPatientId || null, // 
            };

            if (isEdit) {
                await editAppointment(appointment._id, data);
            } else {
                await addAppointment(data);
            }
            onClose();
        } catch (err: any) {
            setError("Failed to save appointment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {isEdit ? "Edit Appointment" : "New Appointment"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/*  Link to existing patient (optional) */}
                    <div>
                        <label className="block font-medium mb-1 text-sm">
                            Link to existing patient <span className="text-gray-400">(optional — for follow-up)</span>
                        </label>
                        <select
                            className="border p-2 rounded w-full bg-white dark:bg-gray-800"
                            value={linkedPatientId}
                            onChange={handlePatientSelect}
                        >
                            <option value="">— New patient —</option>
                            {patients
                                .filter(p => !p.isArchived)
                                .map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.patientCode} — {p.fullName}
                                    </option>
                                ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                            If selected, marks a follow-up session for this patient
                        </p>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm">Patient Name*</label>
                        <input
                            required
                            type="text"
                            className="border p-2 rounded w-full"
                            placeholder="John Doe"
                            value={patientName}
                            onChange={e => setPatientName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:gap-4 gap-2">
                        <div>
                            <label className="block font-medium mb-1 text-sm">Date*</label>
                            <input
                                required
                                type="date"
                                className="border p-2 rounded w-full"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-sm">Time*</label>
                            <input
                                required
                                type="time"
                                className="border p-2 rounded w-full"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm">Notes</label>
                        <textarea
                            className="border p-2 rounded w-full"
                            rows={3}
                            placeholder="Any notes..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1 text-sm">📧 Send reminder at</label>
                        <input
                            type="datetime-local"
                            className="border p-2 rounded w-full"
                            value={reminderTime}
                            onChange={e => setReminderTime(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            You'll receive an email reminder at this time
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}