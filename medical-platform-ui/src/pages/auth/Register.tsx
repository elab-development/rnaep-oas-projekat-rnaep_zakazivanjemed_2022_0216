import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, doctorAPI } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ime: "", prezime: "", email: "", lozinka: "", uloga: "PACIJENT", maticniLekarId: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    doctorAPI.getAll()
        .then((res) => setDoctors(res.data))
        .catch(() => setDoctors([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        maticniLekarId: form.maticniLekarId ? Number(form.maticniLekarId) : null,
      };
      await authAPI.register(payload);
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Greška pri registraciji.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registracija</h1>
          <p className="text-gray-500 mb-6 text-sm">Kreirajte nalog na MedPlatformi</p>

          {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                <input
                    type="text" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={form.ime}
                    onChange={(e) => setForm({ ...form, ime: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
                <input
                    type="text" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={form.prezime}
                    onChange={(e) => setForm({ ...form, prezime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                  type="email" required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
              <input
                  type="password" required minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.lozinka}
                  onChange={(e) => setForm({ ...form, lozinka: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uloga</label>
              <input
                  type="hidden"
                  value="PACIJENT"
              />
              <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500">
                Pacijent
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matični lekar <span className="text-gray-400 font-normal">(opciono)</span>
              </label>
              <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.maticniLekarId}
                  onChange={(e) => setForm({ ...form, maticniLekarId: e.target.value })}
              >
                <option value="">— Izaberite kasnije —</option>
                {doctors.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.user?.ime} {d.user?.prezime}
                      {d.specijalnost ? ` — ${d.specijalnost}` : ""}
                      {d.institucija?.naziv ? ` (${d.institucija.naziv})` : ""}
                    </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Ustanova se automatski preuzima od izabranog lekara.
              </p>
            </div>

            <button
                type="submit" disabled={loading}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? "Registrovanje..." : "Registruj se"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Već imate nalog?{" "}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
  );
}