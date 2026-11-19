import api from './axiosConfig';

const galleryRequestService = {
  // Student: Get their own requests
  getStudentRequests: async () => {
    try {
      const response = await api.get('/gallery-requests/student');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Student: Create a new upload request using FormData (multipart/form-data)
  createRequest: async (formData) => {
    try {
      const response = await api.post('/gallery-requests/student/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Get all requests
  getAllAdminRequests: async () => {
    try {
      const response = await api.get('/gallery-requests/admin');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Update request status
  updateRequestStatus: async (id, status, rejection_reason = '') => {
    try {
      const response = await api.put(`/gallery-requests/admin/${id}/status`, { status, rejection_reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default galleryRequestService;
