import { useState, useEffect } from "react";
import { doctorAPI, institutionAPI } from "../../services/api";
import api from "../../services/api";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ime: "", prezime: "", email: "", specijalnost: "", institucija: "" });
  const [saving, setSaving] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editForm, setEditForm] = useState({ specijalnost: "", institucijaId: "" });
  const [createdDoctor, setCreatedDoctor] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([doctorAPI.getAll(), institutionAPI.getAll()])
        .then(([d, i]) => { setDoctors(d.data); setInstitutions(i.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await doctorAPI.create(form);
      setDoctors((prev: any) => [...prev, res.data]);
      setCreatedDoctor({ ime: form.ime, prezime: form.prezime, email: form.email });
      setShowForm(false);
      setForm({ ime: "", prezime: "", email: "", specijalnost: "", institucija: "" });
    } catch {
      alert("Greška pri dodavanju lekara.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ukloniti lekara?")) return;
    await doctorAPI.delete(id);
    setDoctors((prev: any) => prev.filter((d: any) => d.id !== id));
    if (editingDoctor === id) setEditingDoctor(null);
  };

  const startEdit = (doctor: any) => {
    setEditingDoctor(doctor.id);
    setEditForm({
      specijalnost: doctor.specijalnost || "",
      institucijaId: doctor.institucija?.id?.toString() || "",
    });
  };

  const handleSaveEdit = async (doctorId: number) => {
    setSaving(true);
    try {
      await api.put(`/api/doctors/${doctorId}`, { specijalnost: editForm.specijalnost });
      if (editForm.institucijaId) {
        await api.put(`/api/doctors/${doctorId}/institucija`, {
          institucijaId: Number(editForm.institucijaId)
        });
      }
      setEditingDoctor(null);
      loadData();
    } catch {
      alert("Greška pri čuvanju izmena.");
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Upravljanje lekarima</h1>
          <button
              onClick={() => { setShowForm(!showForm); setCreatedDoctor(null); }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
          >
            {showForm ? "Otkaži" : "+ Dodaj lekara"}
          </button>
        </div>

        {/* Prikaz kredencijala nakon kreiranja */}
        {createdDoctor && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-green-800 mb-2">
                    ✅ Lekar Dr. {createdDoctor.ime} {createdDoctor.prezime} je uspešno kreiran!
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Prosledite lekaru sledeće kredencijale za prijavu:
                  </p>
                  <div className="bg-white border border-green-200 rounded-lg p-3 space-y-1 text-sm font-mono">
                    <div><span className="text-gray-500">Email:</span> <span className="font-semibold">{createdDoctor.email}</span></div>
                    <div><span className="text-gray-500">Lozinka:</span> <span className="font-semibold">{createdDoctor.ime}123</span></div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">⚠️ Lekar bi trebalo da promeni lozinku nakon prvog logina.</p>
                </div>
                <button
                    onClick={() => setCreatedDoctor(null)}
                    className="text-green-400 hover:text-green-600 text-lg ml-4"
                >
                  ✕
                </button>
              </div>
            </div>
        )}

        {showForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-gray-700 mb-4">Novi lekar</h2>
              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["ime", "Ime"], ["prezime", "Prezime"], ["email", "Email"], ["specijalnost", "Specijalnost"]].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input
                          type={key === "email" ? "email" : "text"}
                          required={key !== "specijalnost"}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={(form as any)[key]}
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
                    <option value="">— Bez ustanove (dodeli kasnije) —</option>
                    {institutions.map((i: any) => <option key={i.id} value={i.id}>{i.naziv}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
                    ℹ️ Lekar će dobiti privremenu lozinku u formatu <strong>[ime]123</strong> (npr. ako je ime "Petar", lozinka je <strong>Petar123</strong>).
                  </div>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                      type="submit" disabled={saving}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {saving ? "Kreiranje..." : "Kreiraj profil"}
                  </button>
                </div>
              </form>
            </div>
        )}

        {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <p>Nema dodanih lekara.</p>
            </div>
        ) : (
            <div className="space-y-3">
              {doctors.map((d: any) => (
                  <div key={d.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          Dr. {d.user?.ime} {d.user?.prezime}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">{d.user?.email}</div>
                        <div className="text-sm text-primary-600 mt-0.5">
                          {d.specijalnost || <span className="text-amber-500">⚠️ Specijalnost nije podešena</span>}
                        </div>
                        <div className="text-sm mt-0.5">
                          {d.institucija ? (
                              <span className="text-green-600">🏥 {d.institucija.naziv}{d.institucija.grad ? ` • ${d.institucija.grad}` : ""}</span>
                          ) : (
                              <span className="text-amber-500">⚠️ Nema dodeljenu ustanovu</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                            onClick={() => editingDoctor === d.id ? setEditingDoctor(null) : startEdit(d)}
                            className="text-sm text-primary-600 hover:underline"
                        >
                          {editingDoctor === d.id ? "Otkaži" : "Izmeni"}
                        </button>
                        <button
                            onClick={() => handleDelete(d.id)}
                            className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Ukloni
                        </button>
                      </div>
                    </div>

                    {editingDoctor === d.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Specijalnost</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={editForm.specijalnost}
                                onChange={(e) => setEditForm({ ...editForm, specijalnost: e.target.value })}
                                placeholder="npr. kardiolog, dermatolog..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Ustanova</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={editForm.institucijaId}
                                onChange={(e) => setEditForm({ ...editForm, institucijaId: e.target.value })}
                            >
                              <option value="">— Bez ustanove —</option>
                              {institutions.map((i: any) => (
                                  <option key={i.id} value={i.id}>{i.naziv}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2 flex justify-end">
                            <button
                                onClick={() => handleSaveEdit(d.id)}
                                disabled={saving}
                                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                            >
                              {saving ? "Čuvanje..." : "Sačuvaj izmene"}
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