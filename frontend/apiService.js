import axios from 'axios';

// ─────────────────────────────────────────────────────────────
// All API calls go through the nginx reverse proxy.
//
// Routing (defined in nginx.conf):
//   /api  → Spring Boot backend  (port 8081 internally)
//   /ai   → FastAPI AI service   (port 8000 internally)
//   /     → React frontend
//
// Never hardcode http://localhost:<port> here — it breaks in
// Docker/production where services run on an internal network.
// ─────────────────────────────────────────────────────────────

const API_BASE = '/api';
const AI_BASE  = '/ai';

// ── Axios instances ───────────────────────────────────────────

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

const aiClient = axios.create({
  baseURL: AI_BASE,
  timeout: 120000,   // AI inference can be slow
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every backend request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler — redirect to login on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── API Service ───────────────────────────────────────────────

const apiService = {

  // ── Users ──────────────────────────────────────────────────
  getUsers:   ()           => apiClient.get('/users/'),
  getUser:    (id)         => apiClient.get(`/users/${id}`),
  updateUser: (id, data)   => apiClient.put(`/users/${id}`, data),
  deleteUser: (id)         => apiClient.delete(`/users/${id}`),

  // ── Patients ───────────────────────────────────────────────
  getPatients:   ()          => apiClient.get('/patients/'),
  getPatient:    (id)        => apiClient.get(`/patients/${id}`),
  updatePatient: (id, data)  => apiClient.put(`/patients/${id}`, data),

  // ── Doctors ────────────────────────────────────────────────
  getDoctors:       ()         => apiClient.get('/doctors/'),
  getActiveDoctors: ()         => apiClient.get('/doctors/active'),
  getDoctor:        (id)       => apiClient.get(`/doctors/${id}`),
  updateDoctor:     (id, data) => apiClient.put(`/doctors/${id}`, data),

  // ── Appointments ───────────────────────────────────────────
  getAppointments:       ()            => apiClient.get('/appointments/'),
  getAppointment:        (id)          => apiClient.get(`/appointments/${id}`),
  createAppointment:     (data)        => apiClient.post('/appointments/', data),
  updateAppointment:     (id, data)    => apiClient.put(`/appointments/${id}`, data),
  deleteAppointment:     (id)          => apiClient.delete(`/appointments/${id}`),
  getPatientAppointments:(patientId)   => apiClient.get(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId)    => apiClient.get(`/appointments/doctor/${doctorId}`),

  // ── Bills ──────────────────────────────────────────────────
  getBills:       ()           => apiClient.get('/bills/'),
  getBill:        (id)         => apiClient.get(`/bills/${id}`),
  updateBill:     (id, data)   => apiClient.put(`/bills/${id}`, data),
  deleteBill:     (id)         => apiClient.delete(`/bills/${id}`),
  getPatientBills:(patientId)  => apiClient.get(`/bills/patient/${patientId}`),

  // ── Medical Records ────────────────────────────────────────
  getMedicalRecords:    ()          => apiClient.get('/medical-records/'),
  getMedicalRecord:     (id)        => apiClient.get(`/medical-records/${id}`),
  createMedicalRecord:  (data)      => apiClient.post('/medical-records/', data),
  updateMedicalRecord:  (id, data)  => apiClient.put(`/medical-records/${id}`, data),
  deleteMedicalRecord:  (id)        => apiClient.delete(`/medical-records/${id}`),
  getPatientRecords:    (patientId) => apiClient.get(`/medical-records/patient/${patientId}`),

  // ── AI Services (routed via nginx /ai → ai-service:8000) ───
  chatWithBot:            (message)    => aiClient.post('/chat', { message }),
  summarizeReport:        (text)       => aiClient.post('/summarize', { text }),
  getSuggestedAppointments:(patientData) => aiClient.post('/suggest-appointments', patientData),
};

export default apiService;
