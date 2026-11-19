import api, { fetchProtectedMediaUrl } from './axiosConfig';

// All functions resolve with the API payload or reject with { message, status }.
const studentService = {
  // Profile & dashboard
  getDashboard: async () => (await api.get('/students/dashboard')).data,
  getProfile: async () => (await api.get('/students/profile')).data,
  updateProfile: async (profileData) => (await api.put('/students/profile', profileData)).data,
  updatePaymentWindow: async (payment_window) => (await api.put('/students/payment-window', { payment_window })).data,

  // Attendance → { records, overall }
  getAttendance: async (month, year) =>
    (await api.get('/students/attendance', { params: month && year ? { month, year } : {} })).data,

  // Fees
  getFees: async () => (await api.get('/students/fees')).data,
  getCurrentPayment: async () => (await api.get('/students/fees/current')).data,
  getPaymentHistory: async () => (await api.get('/students/fees/history')).data,

  // Schedule → { student, batchInfo }
  getSchedule: async () => (await api.get('/students/schedule')).data,

  // Learning resources for the student's level
  getResources: async () => (await api.get('/students/resources')).data,
  openResourceFile: (resourceId) => fetchProtectedMediaUrl(`/resources/${resourceId}/file`),

  // Activity logs
  getActivityLogs: async () => (await api.get('/students/activity-logs')).data,
  getActivityStats: async () => (await api.get('/students/activity-logs/stats')).data,
  createActivityLog: async (logData) => (await api.post('/students/activity-logs', logData)).data,
  updateActivityLog: async (logId, logData) => (await api.put(`/students/activity-logs/${logId}`, logData)).data,
  deleteActivityLog: async (logId) => (await api.delete(`/students/activity-logs/${logId}`)).data,

  // Reviews from teachers
  getReviews: async () => (await api.get('/students/reviews')).data,
  markReviewViewed: async (reviewId) => (await api.put(`/students/reviews/${reviewId}/viewed`)).data,

  // Makeup classes
  getMissedClasses: async () => (await api.get('/students/missed-classes')).data,
  getMakeupBatches: async () => (await api.get('/students/makeup-batches')).data,
  getMakeupRequests: async () => (await api.get('/students/makeup-requests')).data,
  createMakeupRequest: async (requestData) => (await api.post('/students/makeup-requests', requestData)).data,
};

export default studentService;
