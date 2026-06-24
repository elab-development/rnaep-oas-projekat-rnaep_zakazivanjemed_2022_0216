import { useState, useEffect } from "react";
import { institutionAPI } from "../../services/api";

export default function ManageInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ naziv: "", adresa: "", grad: "", telefon: "", lat: "", lng: "" });
  const [saving, setSaving] = useState(false);
  const [editingCoords, setEditingCoords] = useState(null);
  const [coordsForm, setCoordsForm] = useState({ lat: "", lng: "" });

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
      const payload = {
        ...form,
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
      };
      const res = await institutionAPI.create(payload);
      setInstitutions((prev) => [...prev, res.data]);
      setShowForm(false);
      setForm({ naziv: "", adresa: "", grad: "", telefon: "", lat: "", lng: "" });
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

  const startEditCoords = (institution) => {
    setEditingCoords(institution.id);
    setCoordsForm({
      lat: institution.lat?.toString() || "",
      lng: institution.lng?.toString() || "",
    });
  };

  const handleSaveCoords = async (institution) => {
    setSaving(true);
    try {
      const payload = {
        ...institution,
        lat: coordsForm.lat ? parseFloat(coordsForm.lat) : null,
        lng: coordsForm.lng ? parseFloat(coordsForm.lng) : null,
      };
      const res = await institutionAPI.update(institution.id, payload);
      setInstitutions((prev) => prev.map((i) => i.id === institution.id ? res.data : i));
      setEditingCoords(null);
    } catch {
      alert("Greška pri čuvanju koordinata.");
    } finally {
      setSaving(false);
    }
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
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Geografska širina (lat) <span className="text-gray-400 font-normal">— opciono</span>
                  </label>
                  <input
                      type="number" step="any" placeholder="npr. 44.8176"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Geografska dužina (lng) <span className="text-gray-400 font-normal">— opciono</span>
                  </label>
                  <input
                      type="number" step="any" placeholder="npr. 20.4569"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-700">
                    💡 Koordinate možete pronaći na <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline">openstreetmap.org</a> — kliknite desnim klikom na lokaciju → "Show address"
                  </div>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" disabled={saving}
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
            <div className="space-y-3">
              {institutions.map((i) => (
                  <div key={i.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{i.naziv}</div>
                        <div className="text-sm text-gray-500">
                          {i.adresa}, {i.grad} {i.telefon && `• ${i.telefon}`}
                        </div>
                        {i.lat && i.lng ? (
                            <div className="text-xs text-green-600 mt-0.5">📍 {i.lat}, {i.lng}</div>
                        ) : (
                            <div className="text-xs text-amber-500 mt-0.5">⚠️ Koordinate nisu unete</div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => editingCoords === i.id ? setEditingCoords(null) : startEditCoords(i)}
                            className="text-sm text-primary-600 hover:underline"
                        >
                          {editingCoords === i.id ? "Otkaži" : "Izmeni koordinate"}
                        </button>
                        <button
                            onClick={() => handleDelete(i.id)}
                            className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Ukloni
                        </button>
                      </div>
                    </div>

                    {editingCoords === i.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Lat</label>
                            <input
                                type="number" step="any" placeholder="npr. 44.8176"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={coordsForm.lat}
                                onChange={(e) => setCoordsForm({ ...coordsForm, lat: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Lng</label>
                            <input
                                type="number" step="any" placeholder="npr. 20.4569"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={coordsForm.lng}
                                onChange={(e) => setCoordsForm({ ...coordsForm, lng: e.target.value })}
                            />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button
                                onClick={() => handleSaveCoords(i)}
                                disabled={saving}
                                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                            >
                              {saving ? "Čuvanje..." : "Sačuvaj koordinate"}
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}