import api from './axiosConfig';

const multipart = { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 };

const galleryRequestService = {
  // Student: own upload requests
  getStudentRequests: async () => (await api.get('/gallery-requests/student')).data,
  // Student: new upload request (FormData)
  createRequest: async (formData) => (await api.post('/gallery-requests/student/upload', formData, multipart)).data,
  // Admin: all requests
  getAllAdminRequests: async () => (await api.get('/gallery-requests/admin')).data,
  // Admin: approve / reject
  updateRequestStatus: async (id, status, rejection_reason = '') =>
    (await api.put(`/gallery-requests/admin/${id}/status`, { status, rejection_reason })).data,
};

export default galleryRequestService;
