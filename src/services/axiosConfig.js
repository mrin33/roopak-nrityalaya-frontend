import axios from 'axios';

// Backend origin, e.g. https://api.example.com (set VITE_API_URL at build time;
// a trailing "/api" is tolerated). Development falls back to the local API;
// a production build without it calls the same origin (reverse-proxy setups).
const configuredOrigin = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
export const API_ORIGIN = configuredOrigin.replace(/\/+$/, '').replace(/\/api$/, '');

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
  (response) => {
    // Unwrap the API envelope { success: true, message?, data } so services
    // receive the payload directly; the message stays available.
    const body = response.data;
    if (body && typeof body === 'object' && body.success === true && 'data' in body) {
      response.message = body.message;
      response.data = body.data;
    }
    return response;
  },
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
