import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Patient
import PatientDashboard from "./pages/patient/Dashboard";
import SearchDoctors from "./pages/patient/SearchDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import MedicalHistory from "./pages/patient/MedicalHistory";

// Doctor
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorSchedule from "./pages/doctor/Schedule";
import PatientList from "./pages/doctor/PatientList";

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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