import { useState, useEffect } from "react";
import { medicalAPI } from "../../services/api";

export default function MedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    medicalAPI.getMyRecords()
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Medicinska istorija</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p>Nemate medicinskih zapisa.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {new Date(record.datumPregleda).toLocaleDateString("sr-RS")} — Dr. {record.doktorIme}
                  </div>
                  <div className="text-sm text-primary-600 mt-0.5">{record.dijagnoza}</div>
                </div>
                <span className="text-gray-400 text-lg">{expanded === record.id ? "▲" : "▼"}</span>
              </button>

              {expanded === record.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                  {record.simptomi?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Simptomi</div>
                      <div className="flex flex-wrap gap-2">
                        {record.simptomi.map((s, i) => (
                          <span key={i} className="bg-yellow-50 text-yellow-700 text-xs px-2.5 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {record.recepti?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Recepti</div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {record.recepti.map((r, i) => (
                          <li key={i}>💊 {r.lek} — {r.doza}, {r.trajanje}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {record.napomene && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Napomene</div>
                      <p className="text-sm text-gray-700">{record.napomene}</p>
                    </div>
                  )}
                  {record.followUpDate && (
                    <div className="text-sm text-blue-600">
                      📅 Kontrola: {new Date(record.followUpDate).toLocaleDateString("sr-RS")}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}