import api, { fetchProtectedMediaUrl } from './axiosConfig';

// All functions resolve with the API payload or reject with { message, status }.
const teacherService = {
  // Profile & dashboard
  getProfile: async () => (await api.get('/teachers/profile')).data,
  updateProfile: async (profileData) => (await api.put('/teachers/profile', profileData)).data,
  getDashboard: async () => (await api.get('/teachers/dashboard')).data,

  // Students & batches
  getStudents: async () => (await api.get('/teachers/students')).data,
  getBatches: async () => (await api.get('/teachers/batches')).data,

  // Attendance
  getBatchAttendance: async (batchId, date) =>
    (await api.get(`/teachers/batches/${batchId}/attendance`, { params: { date } })).data,
  markAttendance: async ({ batch_id, attendance_date, records }) =>
    (await api.post('/teachers/attendance', { batch_id, attendance_date, records })).data,

  // Reviews
  createReview: async (reviewData) => (await api.post('/teachers/reviews', reviewData)).data,
  getReviews: async () => (await api.get('/teachers/reviews')).data,

  // Batch transfers
  getMyTransfers: async () => (await api.get('/teachers/batch-transfers')).data,
  createTransfer: async (transferData) => (await api.post('/teachers/batch-transfers', transferData)).data,
  getAvailableTeachers: async () => (await api.get('/teachers/batch-transfers/available-teachers')).data,

  // Learning resources — formData (multipart, field "file") or { title, external_url, ... }
  getResources: async () => (await api.get('/teachers/resources')).data,
  createResource: async (payload) =>
    (
      await api.post('/teachers/resources', payload, payload instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }
        : undefined)
    ).data,
  deleteResource: async (resourceId) => (await api.delete(`/teachers/resources/${resourceId}`)).data,
  openResourceFile: (resourceId) => fetchProtectedMediaUrl(`/resources/${resourceId}/file`),

  // Makeup class requests for this teacher's batches
  getMakeupRequests: async () => (await api.get('/teachers/makeup-requests')).data,
  updateMakeupRequest: async (bookingId, status, notes) =>
    (await api.put(`/teachers/makeup-requests/${bookingId}`, { status, notes })).data,
};

export default teacherService;
