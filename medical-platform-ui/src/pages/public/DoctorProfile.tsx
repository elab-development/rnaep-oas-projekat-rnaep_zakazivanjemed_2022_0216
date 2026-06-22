import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doctorAPI } from "../../services/api";
import api from "../../services/api";

const DANI_ORDER = ["PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA", "NEDELJA"];

export default function DoctorProfile() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            doctorAPI.getById(doctorId),
            api.get(`/api/schedules/my/${doctorId}`)
                .catch(() => ({ data: [] }))
        ])
            .then(([docRes, schedRes]) => {
                setDoctor(docRes.data);
                // schedules koriste user.id doktora, ne doctor.id
                const userId = docRes.data?.user?.id;
                if (userId) {
                    api.get(`/api/schedules/my/${userId}`)
                        .then((res) => setSchedules(res.data))
                        .catch(() => setSchedules([]));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [doctorId]);

    const sortedSchedules = [...schedules].sort(
        (a, b) => DANI_ORDER.indexOf(a.dan) - DANI_ORDER.indexOf(b.dan)
    );

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-24 text-gray-400">
                <div className="text-4xl mb-3">👨‍⚕️</div>
                <p>Lekar nije pronađen.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-1">
                ← Nazad
            </button>

            {/* Header kartice */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl mb-3">
                            👨‍⚕️
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dr. {doctor.user?.ime} {doctor.user?.prezime}
                        </h1>
                        <div className="text-primary-600 font-medium mt-1">
                            {doctor.specijalnost || "Opšta praksa"}
                        </div>
                    </div>

                    {/* Dugme za zakazivanje */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {user?.uloga === "PACIJENT" ? (
                            <button
                                onClick={() => navigate(`/patient/book/${doctor.id}`)}
                                className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition"
                            >
                                Zakaži pregled
                            </button>
                        ) : !user ? (
                            <div className="text-right">
                                <div className="text-sm text-gray-500 mb-2">Za zakazivanje je potrebna registracija</div>
                                <div className="flex gap-2">
                                    <Link
                                        to="/register"
                                        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                                    >
                                        Registrujte se
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="border border-primary-600 text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition"
                                    >
                                        Prijavite se
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Ustanova */}
            {doctor.institucija && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ustanova</h2>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🏥</span>
                        <div>
                            <div className="font-semibold text-gray-800">{doctor.institucija.naziv}</div>
                            {doctor.institucija.adresa && (
                                <div className="text-sm text-gray-500 mt-0.5">
                                    {doctor.institucija.adresa}
                                    {doctor.institucija.grad ? `, ${doctor.institucija.grad}` : ""}
                                </div>
                            )}
                            {doctor.institucija.telefon && (
                                <div className="text-sm text-gray-500 mt-0.5">
                                    📞 {doctor.institucija.telefon}
                                </div>
                            )}
                            <Link
                                to={`/institutions/${doctor.institucija.id}`}
                                className="text-xs text-primary-600 hover:underline mt-1 inline-block"
                            >
                                Pogledaj profil ustanove →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Radno vreme */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Radno vreme</h2>
                {sortedSchedules.length === 0 ? (
                    <p className="text-gray-400 text-sm">Radno vreme nije podešeno.</p>
                ) : (
                    <div className="space-y-2">
                        {sortedSchedules.map((s) => (
                            <div key={s.id} className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700 w-32">{s.dan}</span>
                                <span className="text-gray-500">{s.pocetak} – {s.kraj}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Biografija */}
            {doctor.biografija && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">O lekaru</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{doctor.biografija}</p>
                </div>
            )}

            {/* Poziv na akciju za neregistrovane */}
            {!user && (
                <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 text-center">
                    <div className="text-2xl mb-2">📅</div>
                    <h3 className="font-semibold text-primary-800 mb-1">Želite da zakažete pregled?</h3>
                    <p className="text-sm text-primary-600 mb-4">Registrujte se ili se prijavite da biste zakazali pregled kod Dr. {doctor.user?.ime} {doctor.user?.prezime}.</p>
                    <div className="flex justify-center gap-3">
                        <Link
                            to="/register"
                            className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                        >
                            Registrujte se
                        </Link>
                        <Link
                            to="/login"
                            className="border border-primary-600 text-primary-600 px-5 py-2 rounded-lg font-semibold hover:bg-primary-50 transition"
                        >
                            Prijavite se
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}