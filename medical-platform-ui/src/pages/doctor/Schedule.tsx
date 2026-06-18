import { useState, useEffect } from "react";
import api from "../../services/api";

const DANI = ["PONEDELJAK", "UTORAK", "SREDA", "CETVRTAK", "PETAK", "SUBOTA", "NEDELJA"];

interface Schedule {
  id: number;
  dan: string;
  pocetak: string;
  kraj: string;
}

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ dan: "PONEDELJAK", pocetak: "09:00", kraj: "17:00" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/api/schedules/my")
      .then((res) => setSchedules(res.data))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/api/schedules", form);
      setSchedules((prev) => [...prev, res.data as Schedule]);
      setForm({ dan: "PONEDELJAK", pocetak: "09:00", kraj: "17:00" });
    } catch {
      alert("Greška pri čuvanju rasporeda.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/schedules/${id}`);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Moj raspored rada</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">Dodaj termin rada</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Dan</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.dan}
              onChange={(e) => setForm({ ...form, dan: e.target.value })}
            >
              {DANI.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Početak</label>
            <input
              type="time"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.pocetak}
              onChange={(e) => setForm({ ...form, pocetak: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Kraj</label>
            <input
              type="time"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.kraj}
              onChange={(e) => setForm({ ...form, kraj: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {saving ? "Čuvanje..." : "Dodaj"}
          </button>
        </form>
      </div>

      <h2 className="font-semibold text-gray-700 mb-4">Trenutni raspored</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : schedules.length === 0 ? (
        <p className="text-gray-400 text-sm">Nije podešen raspored rada.</p>
      ) : (
        <div className="space-y-2">
          {schedules.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">{s.dan}</span>
                <span className="text-gray-500 text-sm ml-3">{s.pocetak} – {s.kraj}</span>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Ukloni
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}