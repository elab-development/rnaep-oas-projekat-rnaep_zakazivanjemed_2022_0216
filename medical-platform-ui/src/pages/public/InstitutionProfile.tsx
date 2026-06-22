import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function InstitutionProfile() {
    const { institutionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [institution, setInstitution] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/api/institutions/${institutionId}`),
            api.get("/api/doctors/search", { params: { specijalnost: "", grad: "", ime: "" } })
        ])
            .then(([instRes, docRes]) => {
                setInstitution(instRes.data);
                // Filtriramo samo doktore koji rade u ovoj ustanovi
                const filtered = docRes.data.filter(
                    (d) => d.institucija?.id === Number(institutionId)
                );
                setDoctors(filtered);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [institutionId]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!institution) {
        return (
            <div className="text-center py-24 text-gray-400">
                <div className="text-4xl mb-3">🏥</div>
                <p>Ustanova nije pronađena.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-1">
                ← Nazad
            </button>

            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">🏥</div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{institution.naziv}</h1>
                        {institution.grad && (
                            <div className="text-gray-500 text-sm mt-1">{institution.grad}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Kontakt informacije */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Kontakt informacije</h2>
                <div className="space-y-3">
                    {institution.adresa && (
                        <div className="flex items-start gap-3">
                            <span className="text-gray-400 mt-0.5">📍</span>
                            <div>
                                <div className="text-xs text-gray-400 mb-0.5">Adresa</div>
                                <div className="text-sm text-gray-700">{institution.adresa}{institution.grad ? `, ${institution.grad}` : ""}</div>
                            </div>
                        </div>
                    )}
                    {institution.telefon && (
                        <div className="flex items-start gap-3">
                            <span className="text-gray-400 mt-0.5">📞</span>
                            <div>
                                <div className="text-xs text-gray-400 mb-0.5">Telefon</div>
                                <div className="text-sm text-gray-700">{institution.telefon}</div>
                            </div>
                        </div>
                    )}
                    {institution.email && (
                        <div className="flex items-start gap-3">
                            <span className="text-gray-400 mt-0.5">✉️</span>
                            <div>
                                <div className="text-xs text-gray-400 mb-0.5">Email</div>
                                <div className="text-sm text-gray-700">{institution.email}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mapa ako ima koordinate */}
            {institution.lat && institution.lng && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Lokacija</h2>
                    <a
                        href={`https://www.openstreetmap.org/?mlat=${institution.lat}&mlon=${institution.lng}&zoom=16`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                    >
                        📍 Pogledajte na mapi →
                    </a>
                </div>
            )}

            {/* Lista lekara */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Lekari u ustanovi
                    <span className="ml-2 text-primary-600 normal-case font-normal">({doctors.length})</span>
                </h2>

                {doctors.length === 0 ? (
                    <p className="text-gray-400 text-sm">Nema lekara u ovoj ustanovi.</p>
                ) : (
                    <div className="space-y-3">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition">
                                <div>
                                    <div className="font-medium text-gray-800">
                                        Dr. {doctor.user?.ime} {doctor.user?.prezime}
                                    </div>
                                    <div className="text-sm text-primary-600 mt-0.5">
                                        {doctor.specijalnost || "Opšta praksa"}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    {user?.uloga === "PACIJENT" && (
                                        <Link
                                            to={`/patient/book/${doctor.id}`}
                                            className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-700 transition"
                                        >
                                            Zakaži
                                        </Link>
                                    )}
                                    <Link
                                        to={`/doctors/${doctor.id}`}
                                        className="text-xs text-primary-600 hover:underline"
                                    >
                                        Pogledaj profil →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!user && doctors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 mb-3">Prijavite se da biste zakazali pregled</p>
                        <div className="flex justify-center gap-3">
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
                )}
            </div>
        </div>
    );
}