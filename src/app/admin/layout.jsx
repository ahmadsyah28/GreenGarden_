// app/admin/layout.js
"use client";

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import AuthContext from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      // Jika tidak terautentikasi, redirect ke login
      if (!isAuthenticated) {
        router.push('/login');
      }
      // Jika terautentikasi tapi bukan admin, redirect ke home
      else if (user && user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, router, user]);
  
  // Tampilkan loading saat masih checking auth
  if (loading || !isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50806B]"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}