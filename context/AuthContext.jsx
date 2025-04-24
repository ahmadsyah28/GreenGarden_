'use client';

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
      console.log('Checking if user is logged in...');
      const res = await axios.get('/api/auth/me');
      console.log('User data from /api/auth/me:', res.data);
      
      if (res.data.user) {
        console.log('User is authenticated:', res.data.user);
        console.log('User role:', res.data.user.role);
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      console.log('Attempting to login user:', userData.email);
      
      const res = await axios.post('/api/auth/login', userData);
      console.log('Login response:', res.data);
      
      if (res.data.user) {
        console.log('User authenticated successfully');
        console.log('User data:', res.data.user);
        console.log('User role:', res.data.user.role);
        
        setUser(res.data.user);
        setIsAuthenticated(true);
        
        // Don't call checkUserLoggedIn() here as it might override
        // the user data we just received
        
        // Redirect berdasarkan role user
        if (res.data.user.role === 'admin') {
          console.log('User is ADMIN, redirecting to admin dashboard');
          // Use setTimeout to ensure state is updated before redirect
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 100);
        } else {
          console.log('User is not ADMIN, redirecting to home');
          router.push('/');
        }
        
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering new user:', userData.email);
      
      const res = await axios.post('/api/auth/register', userData);
      console.log('Registration response:', res.data);
      
      if (res.data.user) {
        console.log('User registered successfully');
        // Redirect ke halaman login setelah berhasil register
        router.push('/login?registered=true');
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await axios.post('/api/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } catch (err) {
      console.error('Logout error', err);
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