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

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      console.log('Memeriksa status login pengguna...');
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      console.log('Data pengguna dari /api/auth/me:', res.data);
      
      if (res.data.user) {
        console.log('Pengguna terautentikasi:', res.data.user);
        console.log('Peran pengguna:', res.data.user.role);
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('Tidak ada token valid, pengguna tidak terautentikasi');
        // Normal untuk pengguna yang belum login
      } else {
        console.error('Kesalahan saat memeriksa autentikasi:', err);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      console.log('Mencoba login pengguna:', userData.email);
      
      const res = await axios.post('/api/auth/login', userData, { withCredentials: true });
      console.log('Respons login:', res.data);
      
      if (res.data.user) {
        console.log('Pengguna berhasil terautentikasi');
        console.log('Data pengguna:', res.data.user);
        console.log('Peran pengguna:', res.data.user.role);
        
        setUser(res.data.user);
        setIsAuthenticated(true);
        
        // Redirect berdasarkan peran pengguna
        if (res.data.user.role === 'admin') {
          console.log('Pengguna adalah ADMIN, mengalihkan ke dashboard admin');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 100);
        } else {
          console.log('Pengguna bukan ADMIN, mengalihkan ke beranda');
          router.push('/');
        }
        
        return true;
      }
    } catch (err) {
      console.error('Kesalahan login:', err);
      setError(err.response?.data?.error || 'Terjadi kesalahan saat login');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Mendaftarkan pengguna baru:', userData.email);
      
      const res = await axios.post('/api/auth/register', userData, { withCredentials: true });
      console.log('Respons pendaftaran:', res.data);
      
      if (res.data.user) {
        console.log('Pengguna berhasil terdaftar');
        router.push('/login?registered=true');
        return true;
      }
    } catch (err) {
      console.error('Kesalahan pendaftaran:', err);
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mendaftar');
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Mengeluarkan pengguna');
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } catch (err) {
      console.error('Kesalahan logout:', err);
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
        clearErrors,
        checkUserLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;