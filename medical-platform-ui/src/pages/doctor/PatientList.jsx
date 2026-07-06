import { useState, useEffect } from "react";
import api from "../../services/api";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) return;
        api.get(`/api/appointments/doctor/${user.id}/patient-summaries`)
            .then((res) => setPatients(res.data))
            .catch(() => setPatients([]))
            .finally(() => setLoading(false));
    }, []);

  const filtered = patients.filter((p) =>
    `${p.ime} ${p.prezime} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Moji pacijenti</h1>

      <input
        type="text"
        placeholder="Pretraži po imenu ili emailu..."
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">👥</div>
          <p>Nema pacijenata.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">{p.ime} {p.prezime}</div>
                <div className="text-sm text-gray-500">{p.email}</div>
              </div>
              <div className="text-sm text-gray-400">{p.brojPregleda} pregleda</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}