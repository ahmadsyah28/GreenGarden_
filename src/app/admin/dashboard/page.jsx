"use client";

import { useState, useEffect, useContext } from "react";
import { FaUsers, FaShoppingCart, FaBlog, FaLeaf } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    users: [],
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalArticles: 0,
      totalProducts: 0
    },
    loading: true
  });

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${document.cookie
              .split("; ")
              .find((row) => row.startsWith("auth_token="))
              ?.split("=")[1]}`,
          },
        });

        let orders = [];
        if (ordersResponse.ok) {
          orders = await ordersResponse.json();
        }

        // Fetch users (create this endpoint later)
        // const usersResponse = await fetch("/api/admin/users", {
        //   headers: {
        //     Authorization: `Bearer ${document.cookie
        //       .split("; ")
        //       .find((row) => row.startsWith("auth_token="))
        //       ?.split("=")[1]}`,
        //   },
        // });

        // let users = [];
        // if (usersResponse.ok) {
        //   users = await usersResponse.json();
        // }

        // For now, use dummy users data
        const users = [
          { _id: "1", name: "Anita Wijaya", email: "anita@example.com", createdAt: "2025-04-20", status: "active" },
          { _id: "2", name: "Rudi Hartono", email: "rudi@example.com", createdAt: "2025-04-19", status: "active" },
          { _id: "3", name: "Maya Indah", email: "maya@example.com", createdAt: "2025-04-18", status: "active" },
          { _id: "4", name: "Doni Kusuma", email: "doni@example.com", createdAt: "2025-04-17", status: "inactive" },
          { _id: "5", name: "Linda Sari", email: "linda@example.com", createdAt: "2025-04-16", status: "active" }
        ];

        setDashboardData({
          orders: orders.slice(0, 5), // Get latest 5 orders
          users: users.slice(0, 5), // Get latest 5 users
          stats: {
            totalUsers: users.length,
            totalOrders: orders.length,
            totalArticles: 126, // Dummy data
            totalProducts: 328 // Dummy data
          },
          loading: false
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  // Format price to Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusMap = {
      'selesai': 'bg-green-100 text-green-800',
      'shipped': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Stats cards data with real data
  const statsCards = [
    {
      title: "Total Pengguna",
      value: dashboardData.stats.totalUsers.toLocaleString(),
      icon: <FaUsers className="text-blue-500" />,
      change: "+12.5%",
      period: "dari bulan lalu"
    },
    {
      title: "Total Pesanan",
      value: dashboardData.stats.totalOrders.toLocaleString(),
      icon: <FaShoppingCart className="text-green-500" />,
      change: "+18.2%",
      period: "dari bulan lalu"
    },
    {
      title: "Total Artikel",
      value: dashboardData.stats.totalArticles.toLocaleString(),
      icon: <FaBlog className="text-purple-500" />,
      change: "+5.3%",
      period: "dari bulan lalu"
    },
    {
      title: "Total Produk",
      value: dashboardData.stats.totalProducts.toLocaleString(),
      icon: <FaLeaf className="text-[#50806B]" />,
      change: "+7.8%",
      period: "dari bulan lalu"
    }
  ];

  if (dashboardData.loading) {
    return (
      <div className="p-1 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#285A43]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Selamat datang di panel admin Green Garden</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border-l-4 border-[#50806B]"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-xs font-medium">{card.change}</span>
                  <span className="text-gray-500 text-xs ml-1">{card.period}</span>
                </div>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
            <a href="/admin/orders" className="text-[#50806B] text-sm hover:underline">Lihat Semua</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.orders.length > 0 ? (
                  dashboardData.orders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.user_id?.name || "User tidak ditemukan"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatPrice(order.total_price)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                      Belum ada pesanan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pengguna Terbaru</h2>
            <a href="/admin/users" className="text-[#50806B] text-sm hover:underline">Lihat Semua</a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.users.length > 0 ? (
                  dashboardData.users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                      Belum ada pengguna
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Quick Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#3d6854] via-[#5a9078] to-[#4d8067] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("/images/leaf-pattern.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Tambah Tanaman Hias Baru</h3>
            <p className="text-white/80 mb-4">Tambahkan produk tanaman baru Anda</p>
            <a 
              href="/admin/tanaman-hias" 
              className="inline-flex items-center px-4 py-2 bg-white text-[#3d6854] rounded-lg font-medium transition-colors hover:bg-gray-100"
            >
              Tambah Produk
            </a>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#3d6854] via-[#5a9078] to-[#4d8067] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("/images/leaf-pattern.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Tulis Artikel Blog</h3>
            <p className="text-white/80 mb-4">Buat konten baru untuk blog GreenGarden</p>
            <a 
              href="/admin/blog" 
              className="inline-flex items-center px-4 py-2 bg-white text-[#3d6854] rounded-lg font-medium transition-colors hover:bg-gray-100"
            >
              Tulis Artikel
            </a>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#3d6854] via-[#5a9078] to-[#4d8067] rounded-xl shadow-md p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("/images/leaf-pattern.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Kelola Pesanan</h3>
            <p className="text-white/80 mb-4">Lihat dan kelola pesanan pelanggan</p>
            <a 
              href="/admin/orders" 
              className="inline-flex items-center px-4 py-2 bg-white text-[#3d6854] rounded-lg font-medium transition-colors hover:bg-gray-100"
            >
              Kelola Pesanan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}