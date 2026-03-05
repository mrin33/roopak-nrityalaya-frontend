import api from './axiosConfig';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      console.log('🔵 Auth Service Response:', response.data);
      
      // Backend returns: { success: true, data: { token, user } }
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('✅ Stored token and user');
      }
      
      return response.data; // Return full response with success flag
    } catch (error) {
      console.error('❌ Auth service error:', error);
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