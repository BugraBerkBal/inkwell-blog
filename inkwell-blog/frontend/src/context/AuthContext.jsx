import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

/**
 * AuthProvider: Kullanıcı oturum durumunu tüm uygulamaya sağlar.
 * localStorage'dan token/user alınır, API ile doğrulanır.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // İlk yüklenme

  // Uygulama açılışında localStorage'daki oturumu kontrol et
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch {
          // Token geçersiz, temizle
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Bağlam erişim kancası */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
