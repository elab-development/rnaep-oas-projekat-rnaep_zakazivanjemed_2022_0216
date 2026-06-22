import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { appointmentAPI } from "../../services/api";
import api from "../../services/api";
import { sendAppointmentConfirmation } from "../../services/emailService";
import { useAuth } from "../../context/AuthContext";

export default function RescheduleAppointment() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const appointment = location.state?.appointment;

    const [selectedDate, setSelectedDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!selectedDate || !appointment?.doktorId) return;
        setSlotsLoading(true);
        setSelectedSlot(null);
        setError("");
        appointmentAPI.getAvailableSlots(appointment.doktorId, selectedDate)
            .then((res) => setSlots(res.data))
            .catch(() => setSlots([]))
            .finally(() => setSlotsLoading(false));
    }, [selectedDate, appointment]);

    const handleSubmit = async () => {
        if (!selectedSlot || !selectedDate) return;
        setSaving(true);
        setError("");
        try {
            await api.put(`/api/appointments/${appointmentId}/reschedule`, {
                datum: selectedDate,
                vreme: selectedSlot,
            });

            // Pošalji email potvrdu
            await sendAppointmentConfirmation({
                to_name: user ? `${user.ime} ${user.prezime}` : "Pacijent",
                to_email: user?.email ?? "",
                doctor_name: `Dr. ${appointment?.doktorIme ?? ""} ${appointment?.doktorPrezime ?? ""}`,
                date: new Date(selectedDate).toLocaleDateString("sr-RS"),
                time: selectedSlot,
            });

            setSuccess(true);
            setTimeout(() => navigate("/patient/appointments"), 2500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Greška pri izmeni termina.");
        } finally {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-bold text-gray-800">Termin uspešno izmenjen!</h2>
                    <p className="text-gray-500 mt-2">Poslali smo vam email potvrdu.</p>
                    <p className="text-gray-400 text-sm mt-1">Preusmeravanje na vaše termine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-1">
                ← Nazad
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Izmena termina</h1>

            {appointment && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <div className="text-sm text-gray-500 mb-1">Trenutni termin</div>
                    <div className="font-medium text-gray-800">
                        Dr. {appointment.doktorIme} {appointment.doktorPrezime}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                        {new Date(appointment.datum).toLocaleDateString("sr-RS")} u {appointment.vreme}
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-700 mb-4">Izaberite novi termin</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Novi datum</label>
                    <input
                        type="date"
                        min={today}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {selectedDate && (
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dostupni termini</label>
                        {slotsLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                            </div>
                        ) : slots.length === 0 ? (
                            <p className="text-sm text-gray-400">Nema slobodnih termina za izabrani datum.</p>
                        ) : (
                            <div className="grid grid-cols-4 gap-2">
                                {slots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`py-2 rounded-lg text-sm font-medium border transition ${
                                            selectedSlot === slot
                                                ? "bg-primary-600 text-white border-primary-600"
                                                : "border-gray-300 text-gray-700 hover:border-primary-400"
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={!selectedSlot || saving}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-40"
                >
                    {saving ? "Menjanje..." : "Potvrdi izmenu"}
                </button>
            </div>
        </div>
    );
}