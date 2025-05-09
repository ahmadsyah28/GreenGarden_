// app/login/page.jsx
'use client';

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const { login, isAuthenticated, user, error, clearErrors } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Jika sudah terautentikasi, redirect sesuai peran
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
    
    if (error) {
      setAlert({ show: true, type: "error", message: error });
      clearErrors();
    }
  }, [isAuthenticated, user, error, router, clearErrors]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login({ email, password });
      
      if (success) {
        setAlert({ 
          show: true, 
          type: "success", 
          message: "Login berhasil! Mengalihkan..." 
        });
        
        // Tidak perlu redirect manual di sini - AuthContext akan menanganinya
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-[77px] py-8 flex flex-col md:flex-row gap-8 bg-white">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <Link href="/" className="inline-flex items-center text-[#285A43] font-semibold mb-3 hover:underline md:ml-40">
          <FaChevronLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
        <div className="relative h-[300px] md:h-[600px] w-full max-w-[600px] mx-auto">
          <Image 
            src="/images/login.png" 
            alt="Login"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center mt-8 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-bold">Masuk</h1>
        <p className="text-base md:text-lg font-medium text-gray-600 mb-6">
          Silakan masukkan email dan password Anda
        </p>

        {alert.show && (
          <div 
            className={`mb-4 p-3 rounded ${
              alert.type === "error" 
                ? "bg-red-100 text-red-700 border border-red-300" 
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
            role="alert"
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="w-full max-w-md">
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]"
              placeholder="Masukkan email Anda"
              disabled={isSubmitting}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              {/* <Link href="/forgot-password" className="text-sm text-[#285A43] hover:underline">
                Lupa password?
              </Link> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43]"
                placeholder="Masukkan password Anda"
                minLength="6"
                disabled={isSubmitting}
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
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className={`w-full bg-[#285A43] text-white py-3 rounded-lg font-medium transition-colors
              ${isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-[#1e4231] active:bg-[#193628]'
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#285A43] font-semibold hover:underline">
            Daftar disini
          </Link>
        </p>
      </div>
    </div>
  );
}