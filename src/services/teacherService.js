import api from './axiosConfig';

const teacherService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/teachers/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/teachers/profile', profileData);
    return response.data;
  },

  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/teachers/dashboard');
    return response.data;
  },

  // Students & Batches
  getStudents: async () => {
    const response = await api.get('/teachers/students');
    return response.data;
  },

  getBatches: async () => {
    const response = await api.get('/teachers/batches');
    return response.data;
  },

  // Reviews
  createReview: async (reviewData) => {
    const response = await api.post('/teachers/reviews', reviewData);
    return response.data;
  },

  getReviews: async () => {
    const response = await api.get('/teachers/reviews');
    return response.data;
  },

  // Batch Transfers
  getMyTransfers: async () => {
    const response = await api.get('/teachers/batch-transfers');
    return response.data;
  },

  createTransfer: async (transferData) => {
    const response = await api.post('/teachers/batch-transfers', transferData);
    return response.data;
  },

  getAvailableTeachers: async () => {
    const response = await api.get('/teachers/batch-transfers/available-teachers');
    return response.data;
  }
};

export default teacherService;
