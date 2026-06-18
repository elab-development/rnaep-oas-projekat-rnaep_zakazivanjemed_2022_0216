import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appointmentAPI } from "../../services/api";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Otkazati termin?")) return;
    await appointmentAPI.cancel(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const statusColor = (status) => {
    if (status === "ZAKAZAN") return "bg-green-100 text-green-700";
    if (status === "OTKAZAN") return "bg-red-100 text-red-700";
    if (status === "ZAVRSEN") return "bg-gray-100 text-gray-600";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Zdravo, {user?.ime}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Pregled vaših zakazanih termina</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/patient/search"
          className="bg-primary-600 text-white rounded-xl p-5 hover:bg-primary-700 transition"
        >
          <div className="text-2xl mb-2">🔍</div>
          <div className="font-semibold">Pretraži lekare</div>
          <div className="text-sm text-primary-100 mt-1">Pronađi i zakaži pregled</div>
        </Link>
        <Link
          to="/patient/medical-history"
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-semibold text-gray-800">Medicinska istorija</div>
          <div className="text-sm text-gray-500 mt-1">Pregledi i nalazi</div>
        </Link>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Moji termini</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p>Nemate zakazanih termina.</p>
          <Link to="/patient/search" className="text-primary-600 font-medium mt-2 inline-block hover:underline">
            Zakažite prvi pregled →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">
                  Dr. {a.doktorIme} {a.doktorPrezime}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {a.specijalnost} • {new Date(a.datum).toLocaleDateString("sr-RS")} u {a.vreme}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                  {a.status}
                </span>
                {a.status === "ZAKAZAN" && (
                  <button
                    onClick={() => handleCancel(a.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Otkaži
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}