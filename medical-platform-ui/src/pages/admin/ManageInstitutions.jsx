import { useState, useEffect } from "react";
import { institutionAPI } from "../../services/api";

export default function ManageInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ naziv: "", adresa: "", grad: "", telefon: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    institutionAPI.getAll()
      .then((res) => setInstitutions(res.data))
      .catch(() => setInstitutions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await institutionAPI.create(form);
      setInstitutions((prev) => [...prev, res.data]);
      setShowForm(false);
      setForm({ naziv: "", adresa: "", grad: "", telefon: "" });
    } catch {
      alert("Greška pri dodavanju ustanove.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ukloniti ustanovu?")) return;
    await institutionAPI.delete(id);
    setInstitutions((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Upravljanje ustanovama</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
        >
          {showForm ? "Otkaži" : "+ Dodaj ustanovu"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Nova ustanova</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["naziv", "Naziv"], ["adresa", "Adresa"], ["grad", "Grad"], ["telefon", "Telefon"]].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input
                  type="text"
                  required={key !== "telefon"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
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
      ) : institutions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🏥</div>
          <p>Nema unetih ustanova.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {institutions.map((i) => (
            <div key={i.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">{i.naziv}</div>
                <div className="text-sm text-gray-500">{i.adresa}, {i.grad} {i.telefon && `• ${i.telefon}`}</div>
              </div>
              <button
                onClick={() => handleDelete(i.id)}
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