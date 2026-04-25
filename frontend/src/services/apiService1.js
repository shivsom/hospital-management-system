import axios from 'axios';

const API_BASE_URL = '/api';

const apiService = {
  // Users
  getUsers: () => axios.get(`${API_BASE_URL}/users/`),
  getUser: (id) => axios.get(`${API_BASE_URL}/users/${id}`),
  updateUser: (id, userData) => axios.put(`${API_BASE_URL}/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`${API_BASE_URL}/users/${id}`),

  // Patients
  getPatients: () => axios.get(`${API_BASE_URL}/patients/`),
  getPatient: (id) => axios.get(`${API_BASE_URL}/patients/${id}`),
  updatePatient: (id, patientData) => axios.put(`${API_BASE_URL}/patients/${id}`, patientData),

  // Doctors
  getDoctors: () => axios.get(`${API_BASE_URL}/doctors/`),
  getActiveDoctors: () => axios.get(`${API_BASE_URL}/doctors/active`),
  getDoctor: (id) => axios.get(`${API_BASE_URL}/doctors/${id}`),
  updateDoctor: (id, doctorData) => axios.put(`${API_BASE_URL}/doctors/${id}`, doctorData),

  // Appointments
  getAppointments: () => axios.get(`${API_BASE_URL}/appointments/`),
  getAppointment: (id) => axios.get(`${API_BASE_URL}/appointments/${id}`),
  createAppointment: (appointmentData) => axios.post(`${API_BASE_URL}/appointments/`, appointmentData),
  updateAppointment: (id, appointmentData) => axios.put(`${API_BASE_URL}/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => axios.delete(`${API_BASE_URL}/appointments/${id}`),
  getPatientAppointments: (patientId) => axios.get(`${API_BASE_URL}/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => axios.get(`${API_BASE_URL}/appointments/doctor/${doctorId}`),

  // Bills
  getBills: () => axios.get(`${API_BASE_URL}/bills/`),
  getBill: (id) => axios.get(`${API_BASE_URL}/bills/${id}`),
  updateBill: (id, billData) => axios.put(`${API_BASE_URL}/bills/${id}`, billData),
  deleteBill: (id) => axios.delete(`${API_BASE_URL}/bills/${id}`),
  getPatientBills: (patientId) => axios.get(`${API_BASE_URL}/bills/patient/${patientId}`),

  // Medical Records
  getMedicalRecords: () => axios.get(`${API_BASE_URL}/medical-records/`),
  getMedicalRecord: (id) => axios.get(`${API_BASE_URL}/medical-records/${id}`),
  createMedicalRecord: (recordData) => axios.post(`${API_BASE_URL}/medical-records/`, recordData),
  updateMedicalRecord: (id, recordData) => axios.put(`${API_BASE_URL}/medical-records/${id}`, recordData),
  deleteMedicalRecord: (id) => axios.delete(`${API_BASE_URL}/medical-records/${id}`),
  getPatientRecords: (patientId) => axios.get(`${API_BASE_URL}/medical-records/patient/${patientId}`),

  // AI Services
  chatWithBot: (message) => axios.post('http://localhost:8000/chat', { message }),
  summarizeReport: (reportText) => axios.post('http://localhost:8000/summarize', { text: reportText }),
  getSuggestedAppointments: (patientData) => axios.post('http://localhost:8000/suggest-appointments', patientData)
};

export default apiService;