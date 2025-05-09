'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Redirect jika user belum login
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    // Isi form dengan data user ketika tersedia
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [isAuthenticated, loading, router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    
    // Reset form ke data asli jika cancel edit
    if (editMode) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
        setEditMode(false);
        // Perbarui data context (optional, tergantung implementasi context)
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memperbarui profil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
      console.error('Update profile error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50806B]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#404041] mb-8">Profil Saya</h1>
        
        {message.text && (
          <div 
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3d6854] to-[#5a9078] px-6 py-8 relative">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="relative w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-[#f0f4f1] overflow-hidden">
                    <FaUser className="text-[#50806B] w-16 h-16" />
                  </div>
                </div>
              </div>
              <div className="text-white text-center md:text-left">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-white/80">Customer</p>
                <p className="text-white/80 text-sm mt-1">
                  Bergabung sejak {new Date(user?.createdAt ?? Date.now()).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#404041]">Informasi Pribadi</h3>
                    <button 
                      type="button" 
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        editMode 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : 'bg-[#50806B] text-white hover:bg-[#3d6854]'
                      } transition-colors`}
                      onClick={toggleEditMode}
                    >
                      {editMode ? (
                        <>
                          <FaTimes className="mr-2" /> Batal
                        </>
                      ) : (
                        <>
                          <FaEdit className="mr-2" /> Edit Profil
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`pl-10 w-full p-3 border ${
                        editMode ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B]`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      disabled={true} // Email tidak bisa diedit
                      className="pl-10 w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email tidak dapat diubah</p>
                </div>

                {/* No Handphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Handphone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      className={`pl-10 w-full p-3 border ${
                        editMode ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B]`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value="********"
                      disabled
                      className="pl-10 w-full p-3 border border-gray-200 bg-gray-50 rounded-lg"
                    />
                  </div>
                  <div className="mt-1">
                    <Link href="/customer/change-password" className="text-xs text-[#50806B] hover:underline">
                      Ubah password
                    </Link>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              {editMode && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-3 bg-[#50806B] text-white rounded-lg hover:bg-[#3d6854] transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" /> Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#404041]">Pesanan Terakhir</h3>
            <Link href="/customer/orders" className="text-[#50806B] hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6">
              {/* Placeholder for orders - replace with actual orders data */}
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada pesanan</p>
                <Link href="/" className="mt-2 inline-block text-[#50806B] hover:underline">
                  Mulai Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;