import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function MyProfile() {
    const { user, login, token } = useAuth();
    const [profileForm, setProfileForm] = useState({
        ime: "", prezime: "", telefon: "", adresa: ""
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "", newPassword: "", confirmPassword: ""
    });
    const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
    const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        api.get(`/api/users/${user.id}`)
            .then((res) => {
                setProfileForm({
                    ime: res.data.ime || "",
                    prezime: res.data.prezime || "",
                    telefon: res.data.telefon || "",
                    adresa: res.data.adresa || "",
                });
            })
            .catch(() => {});
    }, [user]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileForm.ime.trim() || !profileForm.prezime.trim()) {
            setProfileMsg({ text: "Ime i prezime su obavezni.", type: "error" });
            return;
        }
        setSavingProfile(true);
        setProfileMsg({ text: "", type: "" });
        try {
            const res = await api.put(`/api/users/${user?.id}/profile`, profileForm);
            // Ažuriraj lokalni auth state
            login({ ...user, ime: res.data.ime, prezime: res.data.prezime }, token!);
            setProfileMsg({ text: "Podaci su uspešno ažurirani.", type: "success" });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setProfileMsg({ text: error.response?.data?.message || "Greška pri ažuriranju.", type: "error" });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMsg({ text: "Nova lozinka i potvrda se ne poklapaju.", type: "error" });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordMsg({ text: "Nova lozinka mora imati najmanje 6 karaktera.", type: "error" });
            return;
        }
        setSavingPassword(true);
        setPasswordMsg({ text: "", type: "" });
        try {
            await api.put(`/api/users/${user?.id}/password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordMsg({ text: "Lozinka je uspešno promenjena.", type: "success" });
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setPasswordMsg({ text: error.response?.data?.message || "Greška pri promeni lozinke.", type: "error" });
        } finally {
            setSavingPassword(false);
        }
    };

    const msgClass = (type: string) =>
        type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-600 border border-red-200";

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Moj nalog</h1>

            {/* Lični podaci */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-5">Lični podaci</h2>

                {profileMsg.text && (
                    <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${msgClass(profileMsg.type)}`}>
                        {profileMsg.text}
                    </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                            <input
                                type="text" required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={profileForm.ime}
                                onChange={(e) => setProfileForm({ ...profileForm, ime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
                            <input
                                type="text" required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={profileForm.prezime}
                                onChange={(e) => setProfileForm({ ...profileForm, prezime: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kontakt telefon <span className="text-gray-400 font-normal">(opciono)</span>
                        </label>
                        <input
                            type="tel"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={profileForm.telefon}
                            onChange={(e) => setProfileForm({ ...profileForm, telefon: e.target.value })}
                            placeholder="npr. +381 60 123 4567"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresa <span className="text-gray-400 font-normal">(opciono)</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={profileForm.adresa}
                            onChange={(e) => setProfileForm({ ...profileForm, adresa: e.target.value })}
                            placeholder="npr. Ulica bb, Beograd"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-gray-400">
                            Email: <span className="text-gray-600">{user?.email}</span>
                        </div>
                        <button
                            type="submit" disabled={savingProfile}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {savingProfile ? "Čuvanje..." : "Sačuvaj izmene"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Promena lozinke */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-5">Promena lozinke</h2>

                {passwordMsg.text && (
                    <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${msgClass(passwordMsg.type)}`}>
                        {passwordMsg.text}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trenutna lozinka</label>
                        <input
                            type="password" required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nova lozinka</label>
                        <input
                            type="password" required minLength={6}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="Najmanje 6 karaktera"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Potvrdite novu lozinku</label>
                        <input
                            type="password" required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit" disabled={savingPassword}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            {savingPassword ? "Menjanje..." : "Promeni lozinku"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}