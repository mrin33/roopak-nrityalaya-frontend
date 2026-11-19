import api from './axiosConfig';

// All functions resolve with the API payload or reject with { message, status }.
// Notices: see noticeService. Gallery requests: see galleryRequestService.
const multipart = { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 };

// Paginated list: { rows, total } (total comes from the X-Total-Count header).
const getPage = async (url, params) => {
  const res = await api.get(url, { params });
  const total = Number(res.headers && res.headers['x-total-count']);
  return { rows: res.data, total: Number.isFinite(total) ? total : res.data.length };
};

const adminService = {
  getDashboard: async () => (await api.get('/admin/dashboard')).data,

  // Students
  getAllStudents: async (params) => (await api.get('/admin/students', { params })).data,
  getStudentDetails: async (studentId) => (await api.get(`/admin/students/${studentId}`)).data,
  createStudent: async (studentData) => (await api.post('/admin/students', studentData)).data, // { student, invite }
  regenerateStudentInvite: async (studentId) => (await api.post(`/admin/students/${studentId}/invite`)).data,
  updateStudent: async (studentId, studentData) => (await api.put(`/admin/students/${studentId}`, studentData)).data,
  deleteStudent: async (studentId) => (await api.delete(`/admin/students/${studentId}`)).data,
  changeStudentStatus: async (studentId, statusData) =>
    (await api.put(`/admin/students/${studentId}/status`, statusData)).data,

  // Teachers
  getAllTeachers: async () => (await api.get('/admin/teachers')).data,
  createTeacher: async (teacherData) => (await api.post('/admin/teachers', teacherData)).data, // { teacher, invite }
  regenerateTeacherInvite: async (teacherId) => (await api.post(`/admin/teachers/${teacherId}/invite`)).data,
  updateTeacher: async (teacherId, teacherData) => (await api.put(`/admin/teachers/${teacherId}`, teacherData)).data,
  deleteTeacher: async (teacherId) => (await api.delete(`/admin/teachers/${teacherId}`)).data,

  // Batches
  getAllBatches: async () => (await api.get('/admin/batches')).data,
  createBatch: async (batchData) => (await api.post('/admin/batches', batchData)).data,
  updateBatch: async (batchId, batchData) => (await api.put(`/admin/batches/${batchId}`, batchData)).data,
  deleteBatch: async (batchId) => (await api.delete(`/admin/batches/${batchId}`)).data,

  // Fees
  getAllFees: async (params) => (await api.get('/admin/fees', { params })).data,
  getFeesPage: (params) => getPage('/admin/fees', params),
  recordFeePayment: async (paymentData) => (await api.post('/admin/fees/record', paymentData)).data,

  // Attendance oversight
  getAttendanceSummary: async (params) => (await api.get('/admin/attendance/summary', { params })).data,

  // Gallery management
  getGallery: async () => (await api.get('/admin/gallery')).data,
  createGalleryItem: async (formData) => (await api.post('/admin/gallery', formData, multipart)).data,
  updateGalleryItem: async (id, data) => (await api.put(`/admin/gallery/${id}`, data)).data,
  deleteGalleryItem: async (id) => (await api.delete(`/admin/gallery/${id}`)).data,

  // Contact-form messages
  getMessages: async () => (await api.get('/admin/messages')).data,
  getMessagesPage: (params) => getPage('/admin/messages', params),
  updateMessage: async (id, is_read) => (await api.put(`/admin/messages/${id}`, { is_read })).data,
  deleteMessage: async (id) => (await api.delete(`/admin/messages/${id}`)).data,

  // Analytics
  getBestTeachers: async () => (await api.get('/admin/analytics/best-teachers')).data,
  getBestStudents: async () => (await api.get('/admin/analytics/best-students')).data,
  getEnrollmentTrends: async () => (await api.get('/admin/analytics/enrollment-trends')).data,
  getDiscontinuationReasons: async () => (await api.get('/admin/analytics/discontinuation-reasons')).data,

  // Status history
  getStatusChanges: async (params) => (await api.get('/admin/status-changes', { params })).data,
  getStatusChangesPage: (params) => getPage('/admin/status-changes', params),
};

export default adminService;
