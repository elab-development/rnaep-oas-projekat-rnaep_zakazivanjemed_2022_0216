import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function AddMedicalRecord() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Podaci o terminu prosleđeni kroz navigate state
    const appointment = location.state?.appointment;

    const [dijagnoza, setDijagnoza] = useState("");
    const [simptomi, setSimptomi] = useState("");
    const [napomene, setNapomene] = useState("");
    const [followUpDate, setFollowUpDate] = useState("");
    const [recepti, setRecepti] = useState([{ lek: "", doza: "", trajanje: "" }]);
    const [saving, setSaving] = useState(false);

    const handleAddRecept = () => {
        setRecepti([...recepti, { lek: "", doza: "", trajanje: "" }]);
    };

    const handleReceptChange = (index, field, value) => {
        const updated = [...recepti];
        updated[index][field] = value;
        setRecepti(updated);
    };

    const handleRemoveRecept = (index) => {
        setRecepti(recepti.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/api/medical-records", {
                appointmentId: appointmentId,
                pacijentId: appointment?.pacijentId,
                doktorId: user.id,
                doktorIme: user.ime,
                doktorPrezime: user.prezime,
                datumPregleda: appointment?.datum || new Date().toISOString().split("T")[0],
                dijagnoza,
                simptomi: simptomi.split(",").map((s) => s.trim()).filter(Boolean),
                recepti: recepti.filter((r) => r.lek.trim() !== ""),
                napomene,
                followUpDate: followUpDate || null,
            });

            // Označi termin kao završen
            if (appointmentId) {
                await api.put(`/api/appointments/${appointmentId}/complete`);
            }

            navigate("/doctor/dashboard");
        } catch (err) {
            alert("Greška pri čuvanju nalaza.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-1">
                ← Nazad
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Unos nalaza</h1>
            {appointment && (
                <p className="text-gray-500 mb-6">
                    Pacijent: {appointment.pacijentIme} {appointment.pacijentPrezime}
                </p>
            )}

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dijagnoza</label>
                    <input
                        type="text" required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={dijagnoza}
                        onChange={(e) => setDijagnoza(e.target.value)}
                        placeholder="npr. Akutni bronhitis"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Simptomi (odvojeni zarezom)</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={simptomi}
                        onChange={(e) => setSimptomi(e.target.value)}
                        placeholder="npr. kašalj, temperatura, malaksalost"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recepti</label>
                    <div className="space-y-2">
                        {recepti.map((r, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text" placeholder="Lek"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={r.lek}
                                    onChange={(e) => handleReceptChange(i, "lek", e.target.value)}
                                />
                                <input
                                    type="text" placeholder="Doza"
                                    className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={r.doza}
                                    onChange={(e) => handleReceptChange(i, "doza", e.target.value)}
                                />
                                <input
                                    type="text" placeholder="Trajanje"
                                    className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    value={r.trajanje}
                                    onChange={(e) => handleReceptChange(i, "trajanje", e.target.value)}
                                />
                                {recepti.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveRecept(i)} className="text-red-400 hover:text-red-600 px-2">
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddRecept}
                        className="text-sm text-primary-600 font-medium mt-2 hover:underline"
                    >
                        + Dodaj još jedan recept
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Napomene</label>
                    <textarea
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={napomene}
                        onChange={(e) => setNapomene(e.target.value)}
                        placeholder="Dodatne napomene za pacijenta..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datum kontrole (opciono)</label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                    {saving ? "Čuvanje..." : "Sačuvaj nalaz"}
                </button>
            </form>
        </div>
    );
}