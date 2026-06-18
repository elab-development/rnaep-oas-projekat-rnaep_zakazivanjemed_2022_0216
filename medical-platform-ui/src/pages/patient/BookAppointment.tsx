import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doctorAPI, appointmentAPI } from "../../services/api";
import { sendAppointmentConfirmation } from "../../services/emailService";

interface Slot {
  id: number;
  vreme: string;
}

interface Doctor {
  user?: { ime: string; prezime: string; email?: string };
  specijalnost?: string;
  institucija?: { naziv: string; grad: string };
}

interface AuthUser {
  ime: string;
  prezime: string;
  email: string;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user as AuthUser | null;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    doctorAPI.getById(doctorId).then((res) => setDoctor(res.data));
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    appointmentAPI.getAvailableSlots(doctorId, selectedDate)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, doctorId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    try {
      await appointmentAPI.book({ doktorId: doctorId, slotId: selectedSlot, datum: selectedDate });

      const slot = slots.find((s) => s.id === selectedSlot);

      await sendAppointmentConfirmation({
        to_name: user ? `${user.ime} ${user.prezime}` : "Pacijent",
        to_email: user?.email ?? "",
        doctor_name: `Dr. ${doctor?.user?.ime ?? ""} ${doctor?.user?.prezime ?? ""}`,
        date: new Date(selectedDate).toLocaleDateString("sr-RS"),
        time: slot?.vreme ?? "",
      });

      setSuccess(true);
      setTimeout(() => navigate("/patient/appointments"), 2000);
    } catch {
      alert("Greška pri zakazivanju. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800">Termin uspešno zakazan!</h2>
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

      {doctor && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="font-semibold text-gray-800 text-lg">
            Dr. {doctor.user?.ime} {doctor.user?.prezime}
          </div>
          <div className="text-primary-600 text-sm mt-0.5">{doctor.specijalnost}</div>
          <div className="text-gray-500 text-sm mt-0.5">
            {doctor.institucija?.naziv} • {doctor.institucija?.grad}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Izaberite datum i termin</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Datum pregleda</label>
          <input
            type="date"
            min={today}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
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
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`py-2 rounded-lg text-sm font-medium border transition ${
                      selectedSlot === slot.id
                        ? "bg-primary-600 text-white border-primary-600"
                        : "border-gray-300 text-gray-700 hover:border-primary-400"
                    }`}
                  >
                    {slot.vreme}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!selectedSlot || loading}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-40"
        >
          {loading ? "Zakazivanje..." : "Potvrdi termin"}
        </button>
      </div>
    </div>
  );
}