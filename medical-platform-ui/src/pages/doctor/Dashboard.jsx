import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { appointmentAPI } from "../../services/api";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    appointmentAPI.getDoctorAppointments(date)
        .then((res) => setAppointments(res.data))
        .catch(() => setAppointments([]))
        .finally(() => setLoading(false));
  }, [date]);

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
            Dr. {user?.ime} {user?.prezime}
          </h1>
          <p className="text-gray-500 mt-1">Pregled dnevnih termina</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Datum:</label>
          <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
          />
          <span className="text-sm text-gray-500">
          {appointments.length} {appointments.length === 1 ? "termin" : "termina"}
        </span>
        </div>

        {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p>Nema zakazanih termina za ovaj dan.</p>
            </div>
        ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                  <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-primary-600 w-14">{a.vreme}</div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {a.pacijentIme} {a.pacijentPrezime}
                        </div>
                        <div className="text-sm text-gray-500">{a.pacijentEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(a.status)}`}>
                  {a.status}
                </span>
                      {a.status === "ZAKAZAN" && (
                          <button
                              onClick={() => navigate(`/doctor/medical-record/${a.id}`, { state: { appointment: a } })}
                              className="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                          >
                            Unesi nalaz
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