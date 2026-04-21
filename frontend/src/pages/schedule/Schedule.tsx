import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointmentStore, type Appointment } from "../../components/hooks/useAppointmentStore";
import AppointmentModal from "./AppointmentModal";
import DayAppointments from "./DayAppointments";


export default function Schedule() {
    const { appointments, fetchAppointments } = useAppointmentStore();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

    const handleEventClick = (info: any) => {
        const clicked = appointments.find((a) => a._id === info.event.id);
        if (clicked) {
            setSelectedDate(clicked.date);
            setEditingAppointment(clicked);
            setShowModal(true);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Convert appointments to FullCalendar events
    const events = appointments.map((a) => ({
        id: a._id,
        title: `${a.time} - ${a.patientName}`,
        date: a.date,
        backgroundColor:
            a.status === "done"
                ? "#22c55e"
                : a.status === "cancelled"
                    ? "#ef4444"
                    : "#3b82f6",
        borderColor: "transparent",
    }));

    const handleDateClick = (info: any) => {
        setSelectedDate(info.dateStr);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setShowModal(true);
    };

    const appointmentsForSelectedDate = appointments.filter(
        (a) => a.date === selectedDate
    );

    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Schedule</h1>
                <button
                    onClick={() => {
                        setEditingAppointment(null);
                        setShowModal(true);
                    }}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition"
                >
                    + New Appointment
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendar */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm overflow-x-auto">
                    <div className="min-w-150">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "",
                            }}
                            height="auto"
                        />
                    </div>
                </div>

                {/* Day Appointments Panel */}
                {selectedDate && (
                    <div className="lg:w-80">
                        <DayAppointments
                            date={selectedDate}
                            appointments={appointmentsForSelectedDate}
                            onEdit={handleEditAppointment}
                            onClose={() => setSelectedDate(null)}
                            onNewAppointment={() => {
                                setEditingAppointment(null);
                                setShowModal(true);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <AppointmentModal
                    defaultDate={selectedDate || ""}
                    appointment={editingAppointment}
                    onClose={() => {
                        setShowModal(false);
                        setEditingAppointment(null);
                    }}
                />
            )}
        </div>
    );
}