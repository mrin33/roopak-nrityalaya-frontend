import api from './axiosConfig';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Backend returns: { success: true, data: { token, user } }
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data; // Return full response with success flag
    } catch (error) {
      throw error;
    }
  },

  // Register new student
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Backend returns: { success: true, data: { token, user } }
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Validate a one-time invitation / reset link
  checkSetupToken: async (token) => {
    const response = await api.get(`/auth/password-setup/${encodeURIComponent(token)}`);
    return response.data.data;
  },

  // Complete an invitation / reset by choosing a password
  setPassword: async (token, password) => {
    const response = await api.post('/auth/set-password', { token, password });
    return response.data;
  },

  // Change password while logged in; stores the fresh session token
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    if (response.data?.data?.token) localStorage.setItem('token', response.data.data.token);
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;