import axios from 'axios';

// Backend origin, e.g. http://localhost:5000 or https://api.example.com
// (configure REACT_APP_API_URL; a trailing "/api" is tolerated).
export const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach the session token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints where a 401 means "wrong credentials/token in the form",
// not "your session expired" — never force a redirect for these.
const AUTH_FORM_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/set-password', '/auth/password-setup', '/auth/change-password'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url || '';
      const isAuthForm = AUTH_FORM_ENDPOINTS.some((p) => url.startsWith(p));

      if (status === 401 && !isAuthForm) {
        // Session expired, revoked, or the account was deactivated.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.assign('/login?session=expired');
        }
      }

      const payload = data && typeof data === 'object' ? data : { message: 'Request failed.' };
      return Promise.reject({ ...payload, status, message: payload.message || 'Request failed.' });
    }
    if (error.request) {
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }
    return Promise.reject({ message: error.message });
  }
);

/**
 * Load a protected media file (e.g. a pending gallery upload) with the
 * Authorization header and return an object URL usable in <img>/<video>.
 * Callers should URL.revokeObjectURL() it when no longer needed.
 */
export const fetchProtectedMediaUrl = async (path) => {
  const response = await api.get(path, { responseType: 'blob' });
  return URL.createObjectURL(response.data);
};

export default api;
