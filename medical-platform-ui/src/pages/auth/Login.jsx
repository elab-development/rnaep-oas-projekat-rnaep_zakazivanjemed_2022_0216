import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", lozinka: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      const uloga = res.data.user.uloga;
      if (uloga === "PACIJENT") navigate("/patient/dashboard");
      else if (uloga === "DOKTOR") navigate("/doctor/dashboard");
      else if (uloga === "ADMIN") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Pogrešan email ili lozinka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dobrodošli</h1>
        <p className="text-gray-500 mb-6 text-sm">Prijavite se na MedPlatformu</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ime@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.lozinka}
              onChange={(e) => setForm({ ...form, lozinka: e.target.value })}
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Nemate nalog?{" "}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Registrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}