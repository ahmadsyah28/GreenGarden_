'use client';

import { useContext, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.push('/login');
      } else {
        router.push('/admin/dashboard'); // Arahkan ke dashboard admin
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // Tidak merender apa pun karena akan dialihkan
}