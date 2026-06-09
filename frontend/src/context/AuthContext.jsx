import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);

    // Event listener for expired token (dispatched by axios interceptor)
    const handleAuthExpired = () => {
      logout();
      navigate('/auth/login', { replace: true });
    };

    window.addEventListener('auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth_expired', handleAuthExpired);
    };
  }, [navigate]);

  /**
   * Action: Authenticate user login credentials
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token: userToken, user: userProfile } = response.data;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userProfile));
      
      setToken(userToken);
      setUser(userProfile);
      
      // Redirect based on role permissions
      if (userProfile.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/staff/dashboard', { replace: true });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Action: Wipe session state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/auth/login', { replace: true });
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
