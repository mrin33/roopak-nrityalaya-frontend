import api, { API_ORIGIN } from './axiosConfig';

// Data for the public website (no login required).
const publicService = {
  getTeachers: async () => (await api.get('/public/teachers')).data,
  getLevels: async () => (await api.get('/public/levels')).data,
  getGallery: async () => (await api.get('/gallery')).data,
  sendContactMessage: async (data) => {
    const response = await api.post('/public/contact', data);
    return response.message;
  },
  // Published gallery media is public: build an absolute URL for <img>/<video>.
  mediaUrl: (mediaUrl) => (mediaUrl ? `${API_ORIGIN}${mediaUrl}` : ''),
};

export default publicService;
