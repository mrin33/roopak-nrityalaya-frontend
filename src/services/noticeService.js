import api from './axiosConfig';

const noticeService = {
  // Public/Authenticated method to get notices
  getNotices: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        queryParams.append('category', filters.category);
      }
      if (filters.target_audience && filters.target_audience !== 'all') {
        queryParams.append('target_audience', filters.target_audience);
      }

      const queryString = queryParams.toString();
      const url = `/notices${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  },

  // Admin-only: Get all notices including drafts
  getAllAdminNotices: async () => {
    try {
      const response = await api.get('/notices/admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin notices:', error);
      throw error;
    }
  },

  // Admin-only: Create a notice
  createNotice: async (noticeData) => {
    try {
      const response = await api.post('/notices', noticeData);
      return response.data;
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  },

  // Admin-only: Update a notice
  updateNotice: async (id, noticeData) => {
    try {
      const response = await api.put(`/notices/${id}`, noticeData);
      return response.data;
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  },

  // Admin-only: Delete a notice
  deleteNotice: async (id) => {
    try {
      const response = await api.delete(`/notices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  }
};

export default noticeService;
