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

// Helper za trenutno ulogovanog korisnika
const getCurrentUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

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
  getAvailableSlots: (doctorId, datum) =>
      api.get(`/api/appointments/slots/${doctorId}`, { params: { datum } }),
  book: (data) => api.post("/api/appointments", data),
  cancel: (id) => api.put(`/api/appointments/${id}/cancel`),
  complete: (id) => api.put(`/api/appointments/${id}/complete`),
  reschedule: (id, datum, vreme) => api.put(`/api/appointments/${id}/reschedule`, { datum, vreme }),
  getDoctorAppointments: (datum) => {
    const user = getCurrentUser();
    return api.get(`/api/appointments/doctor/${user?.id}`, { params: { datum } });
  },
};

// ── Schedules ──────────────────────────────────────
export const scheduleAPI = {
  getMySchedule: () => {
    const user = getCurrentUser();
    return api.get(`/api/schedules/my/${user?.id}`);
  },
  create: (data) => {
    const user = getCurrentUser();
    return api.post("/api/schedules", { ...data, doktorId: user?.id });
  },
  delete: (id) => api.delete(`/api/schedules/${id}`),
};

// ── Medical Records ───────────────────────────────
export const medicalAPI = {
  getMyRecords: () => api.get("/api/medical-records/my"),
  getDoctorRecords: () => {
    const user = getCurrentUser();
    return api.get(`/api/medical-records/doctor/${user?.id}`);
  },
  getById: (id) => api.get(`/api/medical-records/${id}`),
  create: (data) => api.post("/api/medical-records", data),
  update: (id, data) => api.put(`/api/medical-records/${id}`, data),
};

// ── Institutions ──────────────────────────────────
export const institutionAPI = {
  getAll: () => api.get("/api/institutions"),
  create: (data) => api.post("/api/institutions", data),
  update: (id, data) => api.put(`/api/institutions/${id}`, data),
  delete: (id) => api.delete(`/api/institutions/${id}`),
};

export default api;