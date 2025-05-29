'use client';

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Konfigurasi Axios untuk mengirim cookie
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Sinkronkan isAuthenticated dengan user
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const checkUserLoggedIn = async () => {
    try {
      if (isDev) console.log('Memeriksa status login pengguna...');
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      if (isDev) console.log('Data pengguna dari /api/auth/me:', res.data);
      
      if (res.data.user) {
        if (isDev) {
          console.log('Pengguna terautentikasi:', res.data.user);
          console.log('Peran pengguna:', res.data.user.role);
        }
        setUser(res.data.user);
      } else {
        if (isDev) console.log('Tidak ada data pengguna, menganggap tidak terautentikasi');
        setUser(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        if (isDev) console.log('Tidak ada token valid, pengguna tidak terautentikasi');
      } else {
        if (isDev) console.error('Kesalahan saat memeriksa autentikasi:', err.message);
        setError('Gagal memeriksa status autentikasi');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      if (isDev) console.log('Mencoba login pengguna:', userData.email);
      
      const res = await axios.post('/api/auth/login', userData, { withCredentials: true });
      if (isDev) console.log('Respons login:', res.data);
      
      if (res.data.user) {
        if (isDev) {
          console.log('Pengguna berhasil terautentikasi');
          console.log('Data pengguna:', res.data.user);
          console.log('Peran pengguna:', res.data.user.role);
        }
        
        setUser(res.data.user);
        if (res.data.user.role === 'admin') {
          if (isDev) console.log('Mengalihkan ke dashboard admin');
          router.push('/admin');
        } else {
          if (isDev) console.log('Mengalihkan ke beranda');
          router.push('/');
        }
        return true;
      }
    } catch (err) {
      if (isDev) console.error('Kesalahan login:', err);
      setError(err.response?.data?.error || 'Terjadi kesalahan saat login');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      if (isDev) console.log('Mendaftarkan pengguna baru:', userData.email);
      
      const res = await axios.post('/api/auth/register', userData, { withCredentials: true });
      if (isDev) console.log('Respons pendaftaran:', res.data);
      
      if (res.data.user) {
        if (isDev) console.log('Pengguna berhasil terdaftar');
        router.push('/login');
        return true;
      }
    } catch (err) {
      if (isDev) console.error('Kesalahan pendaftaran:', err);
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mendaftar');
      return false;
    }
  };

  const logout = async () => {
    try {
      if (isDev) console.log('Mengeluarkan pengguna');
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      router.push('/');
    } catch (err) {
      if (isDev) console.error('Kesalahan saat logout:', err);
      setError('Gagal logout');
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;