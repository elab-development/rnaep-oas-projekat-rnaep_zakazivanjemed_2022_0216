import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/public/Home";

// Patient
import PatientDashboard from "./pages/patient/Dashboard.tsx";
import SearchDoctors from "./pages/patient/SearchDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import RescheduleAppointment from "./pages/patient/RescheduleAppointment";
import MedicalHistory from "./pages/patient/MedicalHistory";

// Doctor
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorSchedule from "./pages/doctor/Schedule";
import PatientList from "./pages/doctor/PatientList";
import AddMedicalRecord from "./pages/doctor/AddMedicalRecord";
import MyProfile from "./pages/shared/MyProfile";
import DoctorProfile from "./pages/public/DoctorProfile";
import InstitutionProfile from "./pages/public/InstitutionProfile";


// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageInstitutions from "./pages/admin/ManageInstitutions";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="min-h-screen bg-gray-50">
                    <Routes>
                        {/* Javne rute */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
                        <Route path="/institutions/:institutionId" element={<InstitutionProfile />} />

                        {/* Pacijent */}
                        <Route path="/patient/dashboard" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/patient/search" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <SearchDoctors />
                            </ProtectedRoute>
                        } />
                        <Route path="/patient/book/:doctorId" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <BookAppointment />
                            </ProtectedRoute>
                        } />
                        <Route path="/patient/reschedule/:appointmentId" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <RescheduleAppointment />
                            </ProtectedRoute>
                        } />
                        <Route path="/patient/appointments" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/patient/medical-history" element={
                            <ProtectedRoute roles={["PACIJENT"]}>
                                <MedicalHistory />
                            </ProtectedRoute>
                        } />

                        {/* Doktor */}
                        <Route path="/doctor/dashboard" element={
                            <ProtectedRoute roles={["DOKTOR"]}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor/schedule" element={
                            <ProtectedRoute roles={["DOKTOR"]}>
                                <DoctorSchedule />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor/patients" element={
                            <ProtectedRoute roles={["DOKTOR"]}>
                                <PatientList />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor/appointments" element={
                            <ProtectedRoute roles={["DOKTOR"]}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/doctor/medical-record/:appointmentId" element={
                            <ProtectedRoute roles={["DOKTOR"]}>
                                <AddMedicalRecord />
                            </ProtectedRoute>
                        } />

                        {/* Admin */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/doctors" element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <ManageDoctors />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/institutions" element={
                            <ProtectedRoute roles={["ADMIN"]}>
                                <ManageInstitutions />
                            </ProtectedRoute>
                        } />

                        {/* Fallback */}
                        <Route path="/profile" element={
                            <ProtectedRoute roles={["PACIJENT", "DOKTOR", "ADMIN"]}>
                                <MyProfile />
                            </ProtectedRoute>
                        } />
                        <Route path="/unauthorized" element={
                            <div className="flex items-center justify-center min-h-screen">
                                <p className="text-red-500 text-xl">Nemate pristup ovoj stranici.</p>
                            </div>
                        } />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}