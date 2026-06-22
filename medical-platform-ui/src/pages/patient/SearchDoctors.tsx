import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ specijalnost: "", grad: "", ime: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Učitaj sve lekare pri otvaranju stranice
  useEffect(() => {
    doctorAPI.search({ specijalnost: "", grad: "", ime: "" })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await doctorAPI.search(filters);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({ specijalnost: "", grad: "", ime: "" });
    setLoading(true);
    doctorAPI.search({ specijalnost: "", grad: "", ime: "" })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pretraži lekare</h1>

        <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-3">
          <input
              type="text"
              placeholder="Specijalnost (npr. kardiolog)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.specijalnost}
              onChange={(e) => setFilters({ ...filters, specijalnost: e.target.value })}
          />
          <input
              type="text"
              placeholder="Grad"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.grad}
              onChange={(e) => setFilters({ ...filters, grad: e.target.value })}
          />
          <input
              type="text"
              placeholder="Ime lekara"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filters.ime}
              onChange={(e) => setFilters({ ...filters, ime: e.target.value })}
          />
          <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Pretraži
          </button>
          {(filters.specijalnost || filters.grad || filters.ime) && (
              <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm"
              >
                Poništi
              </button>
          )}
        </form>

        {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
        ) : results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>Nema rezultata za zadatu pretragu.</p>
            </div>
        ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">{results.length} {results.length === 1 ? "lekar" : "lekara"}</p>
              <div className="space-y-3">
                {results.map((doctor: any) => (
                    <div key={doctor.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
                      <div>
                        <div className="font-semibold text-gray-800">
                          Dr. {doctor.user?.ime} {doctor.user?.prezime}
                        </div>
                        <div className="text-sm text-primary-600 mt-0.5">
                          {doctor.specijalnost || "Opšta praksa"}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {doctor.institucija?.naziv || "Privatna ordinacija"}
                          {doctor.institucija?.grad ? ` • ${doctor.institucija.grad}` : ""}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={() => navigate(`/patient/book/${doctor.id}`)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                        >
                          Zakaži pregled
                        </button>
                        <Link
                            to={`/doctors/${doctor.id}`}
                            className="text-sm text-primary-600 hover:underline"
                        >
                          Pogledaj profil
                        </Link>
                      </div>
                    </div>
                ))}
              </div>
            </>
        )}
      </div>
  );
}