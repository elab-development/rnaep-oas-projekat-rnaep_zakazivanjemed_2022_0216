import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../services/api";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getMyAppointments()
        .then((res) => setAppointments(res.data))
        .catch(() => setAppointments([]))
        .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Otkazati termin?")) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments((prev: any) =>
          prev.map((a: any) => a.id === id ? { ...a, status: "OTKAZAN" } : a)
      );
    } catch {
      alert("Greška pri otkazivanju termina.");
    }
  };

  const statusColor = (status: string) => {
    if (status === "ZAKAZAN") return "bg-green-100 text-green-700";
    if (status === "OTKAZAN") return "bg-red-100 text-red-600";
    if (status === "ZAVRSEN") return "bg-gray-100 text-gray-500";
    return "bg-blue-100 text-blue-700";
  };

  const upcoming = appointments.filter((a: any) => a.status === "ZAKAZAN");
  const past = appointments.filter((a: any) => a.status !== "ZAKAZAN");

  return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Moji termini</h1>

        {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p>Nemate zakazanih termina.</p>
              <button
                  onClick={() => navigate("/patient/search")}
                  className="mt-4 bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition text-sm"
              >
                Pronađi lekara
              </button>
            </div>
        ) : (
            <>
              {upcoming.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Predstojeći termini ({upcoming.length})
                    </h2>
                    <div className="space-y-3">
                      {upcoming.map((a: any) => (
                          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="font-semibold text-gray-800">
                                  Dr. {a.doktorIme} {a.doktorPrezime}
                                </div>
                                {a.doktorSpecijalnost && (
                                    <div className="text-sm text-primary-600 mt-0.5">{a.doktorSpecijalnost}</div>
                                )}
                                <div className="text-sm text-gray-500 mt-1">
                                  📅 {new Date(a.datum).toLocaleDateString("sr-RS")} u {a.vreme}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                          {a.status}
                        </span>
                                <div className="flex gap-2">
                                  <button
                                      onClick={() => navigate(`/patient/reschedule/${a.id}`, { state: { appointment: a } })}
                                      className="text-xs border border-primary-600 text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition font-medium"
                                  >
                                    Izmeni
                                  </button>
                                  <button
                                      onClick={() => handleCancel(a.id)}
                                      className="text-xs border border-red-300 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium"
                                  >
                                    Otkaži
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {past.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Istorija termina ({past.length})
                    </h2>
                    <div className="space-y-3">
                      {past.map((a: any) => (
                          <div key={a.id} className="bg-white border border-gray-100 rounded-xl p-4 opacity-75">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium text-gray-700">
                                  Dr. {a.doktorIme} {a.doktorPrezime}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  📅 {new Date(a.datum).toLocaleDateString("sr-RS")} u {a.vreme}
                                </div>
                              </div>
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </>
        )}
      </div>
  );
}