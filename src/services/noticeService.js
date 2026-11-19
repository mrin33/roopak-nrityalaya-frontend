import api from './axiosConfig';

const noticeService = {
  // Public/authenticated: notices, optionally filtered by category / audience
  getNotices: async (filters = {}) => {
    const params = {};
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.target_audience && filters.target_audience !== 'all') params.target_audience = filters.target_audience;
    return (await api.get('/notices', { params })).data;
  },
  // Admin: all notices including drafts
  getAllAdminNotices: async () => (await api.get('/notices/admin')).data,
  createNotice: async (noticeData) => (await api.post('/notices', noticeData)).data,
  updateNotice: async (id, noticeData) => (await api.put(`/notices/${id}`, noticeData)).data,
  deleteNotice: async (id) => (await api.delete(`/notices/${id}`)).data,
};

export default noticeService;
