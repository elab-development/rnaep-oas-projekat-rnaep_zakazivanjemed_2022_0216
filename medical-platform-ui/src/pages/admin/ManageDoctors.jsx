import { useState, useEffect } from "react";
import { doctorAPI, institutionAPI } from "../../services/api";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ime: "", prezime: "", email: "", specijalnost: "", institucija: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([doctorAPI.getAll(), institutionAPI.getAll()])
      .then(([d, i]) => { setDoctors(d.data); setInstitutions(i.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await doctorAPI.create(form);
      setDoctors((prev) => [...prev, res.data]);
      setShowForm(false);
      setForm({ ime: "", prezime: "", email: "", specijalnost: "", institucija: "" });
    } catch {
      alert("Greška pri dodavanju lekara.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ukloniti lekara?")) return;
    await doctorAPI.delete(id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upravljanje lekarima</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
        >
          {showForm ? "Otkaži" : "+ Dodaj lekara"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Novi lekar</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["ime", "Ime"], ["prezime", "Prezime"], ["email", "Email"], ["specijalnost", "Specijalnost"]].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input
                  type={key === "email" ? "email" : "text"}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ustanova</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={form.institucija}
                onChange={(e) => setForm({ ...form, institucija: e.target.value })}
              >
                <option value="">— Bez ustanove —</option>
                {institutions.map((i) => <option key={i.id} value={i.id}>{i.naziv}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {saving ? "Čuvanje..." : "Sačuvaj"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="space-y-2">
          {doctors.map((d) => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Dr. {d.user?.ime} {d.user?.prezime}</div>
                <div className="text-sm text-gray-500">{d.specijalnost} • {d.institucija?.naziv}</div>
              </div>
              <button
                onClick={() => handleDelete(d.id)}
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