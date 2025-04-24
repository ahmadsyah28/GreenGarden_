// app/register/page.jsx
'use client';

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }

    if (error) {
      setAlert({ show: true, type: 'error', message: error });
      clearErrors();
    }
  }, [isAuthenticated, error, router, clearErrors]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nama Lengkap harus diisi';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validate phone number
    if (formData.phone && !/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = 'No Handphone hanya boleh berisi angka';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    // Validate password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi Password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      password: formData.password
    });
    
    if (success) {
      setAlert({
        show: true,
        type: 'success',
        message: 'Pendaftaran berhasil! Anda akan dialihkan ke halaman beranda...'
      });
      
      // Redirect to home page after successful registration
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-[77px] py-8 flex flex-col md:flex-row gap-8">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <Link href="/" className="inline-flex items-center text-[#285A43] font-semibold mb-3 hover:underline md:ml-40">
          <FaChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        <div className="relative h-[300px] md:h-[600px] w-full max-w-[600px] mx-auto">
          <Image 
            src="/images/login.png" 
            alt="Registrasi"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-bold">Daftar Akun</h1>
        <p className="text-base md:text-lg font-medium text-gray-600 mb-6">
          Pastikan data yang Anda masukkan benar
        </p>
        
        {alert.show && (
          <div 
            className={`mb-4 p-3 rounded ${
              alert.type === 'error' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="w-full max-w-md">
          {/* Nama Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={isSubmitting}
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]`}
              placeholder="Masukkan nama lengkap Anda"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              disabled={isSubmitting}
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]`}
              placeholder="Masukkan email Anda"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* No Handphone Input */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              No Handphone (Opsional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              disabled={isSubmitting}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]`}
              placeholder="Masukkan nomor handphone Anda"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                disabled={isSubmitting}
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]`}
                placeholder="Minimal 6 karakter"
              />
              <button 
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          {/* Konfirmasi Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                disabled={isSubmitting}
                className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]`}
                placeholder="Ketik ulang password Anda"
              />
              <button 
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Register Button */}
          <button 
            type="submit" 
            className={`w-full bg-[#285A43] text-white py-3 rounded-lg font-medium transition-colors
              ${isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-[#1e4231] active:bg-[#193628]'
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        
        <p className="text-center mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#285A43] font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}