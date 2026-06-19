import axios from "axios";

// Svi pozivi idu kroz API Gateway
const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatski dodaje JWT token na svaki zahtev
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ako server vrati 401, odjavi korisnika
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
};

// ── Doctors ───────────────────────────────────────
export const doctorAPI = {
  search: (params) => api.get("/api/doctors/search", { params }),
  getById: (id) => api.get(`/api/doctors/${id}`),
  getAll: () => api.get("/api/doctors"),
  create: (data) => api.post("/api/doctors", data),
  update: (id, data) => api.put(`/api/doctors/${id}`, data),
  delete: (id) => api.delete(`/api/doctors/${id}`),
};

// ── Appointments ──────────────────────────────────
export const appointmentAPI = {
  getMyAppointments: () => api.get("/api/appointments/my"),
  getAvailableSlots: (doctorId, date) =>
    api.get(`/api/appointments/slots/${doctorId}`, { params: { date } }),
  book: (data) => api.post("/api/appointments", data),
  cancel: (id) => api.put(`/api/appointments/${id}/cancel`),
  getDoctorAppointments: (date) =>
    api.get("/api/appointments/doctor", { params: { date } }),
};

// ── Medical Records ───────────────────────────────
export const medicalAPI = {
  getMyRecords: () => api.get("/api/medical-records/my"),
  getById: (id) => api.get(`/api/medical-records/${id}`),
};

// ── Institutions ──────────────────────────────────
export const institutionAPI = {
  getAll: () => api.get("/api/institutions"),
  create: (data) => api.post("/api/institutions", data),
  update: (id, data) => api.put(`/api/institutions/${id}`, data),
  delete: (id) => api.delete(`/api/institutions/${id}`),
};

export default api;