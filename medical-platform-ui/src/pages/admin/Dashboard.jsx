import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doctorAPI, institutionAPI } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, institutions: 0 });

  useEffect(() => {
    Promise.all([doctorAPI.getAll(), institutionAPI.getAll()])
      .then(([d, i]) => setStats({ doctors: d.data.length, institutions: i.data.length }))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Lekari", value: stats.doctors, icon: "👨‍⚕️", link: "/admin/doctors", color: "bg-blue-50 text-blue-700" },
    { label: "Ustanove", value: stats.institutions, icon: "🏥", link: "/admin/institutions", color: "bg-green-50 text-green-700" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin panel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className={`rounded-xl p-6 ${card.color} hover:shadow-md transition`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm font-medium mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/doctors" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="font-semibold text-gray-800 mb-1">Upravljanje lekarima</div>
          <div className="text-sm text-gray-500">Dodaj, izmeni ili ukloni lekara sa platforme</div>
        </Link>
        <Link to="/admin/institutions" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <div className="font-semibold text-gray-800 mb-1">Upravljanje ustanovama</div>
          <div className="text-sm text-gray-500">Dodaj i upravljaj medicinskim ustanovama</div>
        </Link>
      </div>
    </div>
  );
}