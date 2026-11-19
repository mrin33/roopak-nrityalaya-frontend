import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session, then confirm it with the server so a deactivated
  // or deleted account is not shown as logged in.
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (!storedUser || !authService.getToken()) {
      setLoading(false);
      return;
    }
    setUser(storedUser);
    authService
      .fetchMe()
      .then((me) => {
        const fresh = { userId: me.userId, email: me.email, role: me.role, profile: me.profile };
        setUser(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      })
      .catch(() => {
        // 401s are handled globally (session cleared + redirect);
        // network errors keep the cached user so the app still opens.
      })
      .finally(() => setLoading(false));
  }, []);

  // Both resolve with { token, user } or throw { message }.
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setUser(null);
    authService.logout();
  };

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
