import api from './axiosConfig';

const studentService = {
  // Get student dashboard data
  getDashboard: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  // Get student profile
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  // Update student profile
  updateProfile: async (profileData) => {
    const response = await api.put('/students/profile', profileData);
    return response.data;
  },

  // Get attendance records
  getAttendance: async (month, year) => {
    const response = await api.get('/students/attendance', {
      params: { month, year }
    });
    return response.data;
  },

  // Get fee payments
  getFees: async () => {
    const response = await api.get('/students/fees');
    return response.data;
  },

  // Get current payment due
  getCurrentPayment: async () => {
    const response = await api.get('/students/fees/current');
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/students/fees/history');
    return response.data;
  },

  // Get class schedule
  getSchedule: async () => {
    const response = await api.get('/students/schedule');
    return response.data;
  },

  // Get resources
  getResources: async () => {
    const response = await api.get('/students/resources');
    return response.data;
  },

  // Get activity logs
  getActivityLogs: async () => {
    const response = await api.get('/students/activity-logs');
    return response.data;
  },

  // Create activity log
  createActivityLog: async (logData) => {
    const response = await api.post('/students/activity-logs', logData);
    return response.data;
  },

  // Get reviews
  getReviews: async () => {
    const response = await api.get('/students/reviews');
    return response.data;
  },

  // Get gallery upload requests
  getGalleryRequests: async () => {
    const response = await api.get('/students/gallery-requests');
    return response.data;
  },

  // Submit gallery upload request
  submitGalleryRequest: async (requestData) => {
    const response = await api.post('/students/gallery-requests', requestData);
    return response.data;
  },

  // Get missed classes
  getMissedClasses: async () => {
    const response = await api.get('/students/missed-classes');
    return response.data;
  },

  // Get makeup class requests
  getMakeupRequests: async () => {
    const response = await api.get('/students/makeup-requests');
    return response.data;
  },

  // Create makeup class request
  createMakeupRequest: async (requestData) => {
    const response = await api.post('/students/makeup-requests', requestData);
    return response.data;
  }
};

export default studentService;
