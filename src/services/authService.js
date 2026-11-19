import api from './axiosConfig';

const persistSession = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const authService = {
  // Returns { token, user }; throws { message, status } on failure.
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    persistSession(response.data);
    return response.data;
  },

  // Student self-registration; returns { token, user }.
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    persistSession(response.data);
    return response.data;
  },

  logout: () => {
    // JWTs are stateless: dropping the token ends the session client-side.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.assign('/login');
  },

  // Fresh user + profile from the server.
  fetchMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Validate a one-time invitation / reset link → { email, purpose }
  checkSetupToken: async (token) => {
    const response = await api.get(`/auth/password-setup/${encodeURIComponent(token)}`);
    return response.data;
  },

  // Complete an invitation / reset by choosing a password
  setPassword: async (token, password) => {
    const response = await api.post('/auth/set-password', { token, password });
    return response.data;
  },

  // Change password while logged in; stores the fresh session token
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    if (response.data?.token) localStorage.setItem('token', response.data.token);
    return response.data;
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  getToken: () => localStorage.getItem('token'),
};

export default authService;
