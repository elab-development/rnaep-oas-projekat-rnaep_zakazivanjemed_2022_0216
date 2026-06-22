import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinks = () => {
        if (!user) return null;

        if (user.uloga === "PACIJENT") return (
            <>
                <Link to="/patient/search" className="hover:text-primary-200 transition">Pretraži lekare</Link>
                <Link to="/patient/appointments" className="hover:text-primary-200 transition">Moji termini</Link>
                <Link to="/patient/medical-history" className="hover:text-primary-200 transition">Medicinska istorija</Link>
            </>
        );

        if (user.uloga === "DOKTOR") return (
            <>
                <Link to="/doctor/appointments" className="hover:text-primary-200 transition">Termini</Link>
                <Link to="/doctor/schedule" className="hover:text-primary-200 transition">Moj raspored</Link>
                <Link to="/doctor/patients" className="hover:text-primary-200 transition">Pacijenti</Link>
            </>
        );

        if (user.uloga === "ADMIN") return (
            <>
                <Link to="/admin/doctors" className="hover:text-primary-200 transition">Lekari</Link>
                <Link to="/admin/institutions" className="hover:text-primary-200 transition">Ustanove</Link>
            </>
        );
    };

    return (
        <nav className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <Link to="/" className="text-xl font-bold tracking-tight">
                🏥 MedPlatforma
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium">
                {navLinks()}
                {user ? (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/profile"
                            className="text-primary-100 hover:text-white transition flex items-center gap-1"
                        >
                            👤 {user.ime} {user.prezime}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-white text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition font-semibold"
                        >
                            Odjavi se
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hover:text-primary-200 transition">Prijava</Link>
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition font-semibold"
                        >
                            Registracija
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}