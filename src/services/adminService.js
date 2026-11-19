import api from './axiosConfig';

const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Students
  getAllStudents: async (params) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/admin/students/${studentId}`);
    return response.data;
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/admin/students/${studentId}`);
    return response.data;
  },

  changeStudentStatus: async (studentId, statusData) => {
    const response = await api.put(`/admin/students/${studentId}/status`, statusData);
    return response.data;
  },

  // Teachers
  getAllTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  createTeacher: async (teacherData) => {
    const response = await api.post('/admin/teachers', teacherData);
    return response.data;
  },

  updateTeacher: async (teacherId, teacherData) => {
    const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
    return response.data;
  },

  regenerateTeacherInvite: async (teacherId) => {
    const response = await api.post(`/admin/teachers/${teacherId}/invite`);
    return response.data;
  },

  deleteTeacher: async (teacherId) => {
    const response = await api.delete(`/admin/teachers/${teacherId}`);
    return response.data;
  },

  // Batches
  getAllBatches: async () => {
    const response = await api.get('/admin/batches');
    return response.data;
  },

  createBatch: async (batchData) => {
    const response = await api.post('/admin/batches', batchData);
    return response.data;
  },

  updateBatch: async (batchId, batchData) => {
    const response = await api.put(`/admin/batches/${batchId}`, batchData);
    return response.data;
  },

  deleteBatch: async (batchId) => {
    const response = await api.delete(`/admin/batches/${batchId}`);
    return response.data;
  },

  // Fees
  getAllFees: async (params) => {
    const response = await api.get('/admin/fees', { params });
    return response.data;
  },

  recordFeePayment: async (paymentData) => {
    const response = await api.post('/admin/fees/record', paymentData);
    return response.data;
  },

  // Gallery Requests
  getGalleryRequests: async () => {
    const response = await api.get('/admin/gallery-requests');
    return response.data;
  },

  approveGalleryRequest: async (requestId) => {
    const response = await api.put(`/admin/gallery-requests/${requestId}/approve`);
    return response.data;
  },

  rejectGalleryRequest: async (requestId) => {
    const response = await api.put(`/admin/gallery-requests/${requestId}/reject`);
    return response.data;
  },

  // Analytics
  getBestTeachers: async () => {
    const response = await api.get('/admin/analytics/best-teachers');
    return response.data;
  },

  getBestStudents: async () => {
    const response = await api.get('/admin/analytics/best-students');
    return response.data;
  },

  getEnrollmentTrends: async () => {
    const response = await api.get('/admin/analytics/enrollment-trends');
    return response.data;
  },

  getDiscontinuationReasons: async () => {
    const response = await api.get('/admin/analytics/discontinuation-reasons');
    return response.data;
  },

  // Status Changes
  getStatusChanges: async (params) => {
    const response = await api.get('/admin/status-changes', { params });
    return response.data;
  },

  // Notices
  getAllNotices: async () => {
    const response = await api.get('/admin/notices');
    return response.data;
  },

  createNotice: async (noticeData) => {
    const response = await api.post('/admin/notices', noticeData);
    return response.data;
  },

  updateNotice: async (noticeId, noticeData) => {
    const response = await api.put(`/admin/notices/${noticeId}`, noticeData);
    return response.data;
  },

  deleteNotice: async (noticeId) => {
    const response = await api.delete(`/admin/notices/${noticeId}`);
    return response.data;
  }
};

export default adminService;
