import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../../services/api";
import InstitutionMap from "../../components/InstitutionMap";

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ specijalnost: "", grad: "", ime: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await doctorAPI.search(filters);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Izvuci jedinstvene ustanove iz rezultata za mapu
  const institutions = results
    .map((d: any) => d.institucija)
    .filter(Boolean)
    .filter((inst: any, idx: number, arr: any[]) =>
      arr.findIndex((i) => i.id === inst.id) === idx
    );

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
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p>Nema rezultata za zadatu pretragu.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {results.map((doctor: any) => (
              <div key={doctor.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
                <div>
                  <div className="font-semibold text-gray-800">
                    Dr. {doctor.user?.ime} {doctor.user?.prezime}
                  </div>
                  <div className="text-sm text-primary-600 mt-0.5">{doctor.specijalnost}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {doctor.institucija?.naziv} • {doctor.institucija?.grad}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/patient/book/${doctor.id}`)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                >
                  Zakaži pregled
                </button>
              </div>
            ))}
          </div>

          {institutions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Lokacije ustanova
              </h2>
              <InstitutionMap institutions={institutions} />
              <p className="text-xs text-gray-400 mt-2">
                © OpenStreetMap contributors
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}