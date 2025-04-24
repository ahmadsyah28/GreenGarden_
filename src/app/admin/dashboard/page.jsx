"use client";

import { FaUsers, FaShoppingCart, FaBlog, FaLeaf } from "react-icons/fa";

// Example stats cards data
const statsCards = [
  {
    title: "Total Pengguna",
    value: "1,254",
    icon: <FaUsers className="text-blue-500" />,
    change: "+12.5%",
    period: "dari bulan lalu"
  },
  {
    title: "Total Pesanan",
    value: "845",
    icon: <FaShoppingCart className="text-green-500" />,
    change: "+18.2%",
    period: "dari bulan lalu"
  },
  {
    title: "Total Artikel",
    value: "126",
    icon: <FaBlog className="text-purple-500" />,
    change: "+5.3%",
    period: "dari bulan lalu"
  },
  {
    title: "Total Produk",
    value: "328",
    icon: <FaLeaf className="text-[#50806B]" />,
    change: "+7.8%",
    period: "dari bulan lalu"
  }
];

// Example recent orders data
const recentOrders = [
  { id: "ORD-3721", customer: "Budi Santoso", date: "20 Apr 2025", status: "Selesai", amount: "Rp 350.000" },
  { id: "ORD-3720", customer: "Dewi Lestari", date: "19 Apr 2025", status: "Diproses", amount: "Rp 125.000" },
  { id: "ORD-3719", customer: "Agus Wijaya", date: "19 Apr 2025", status: "Dikirim", amount: "Rp 275.000" },
  { id: "ORD-3718", customer: "Siti Rahayu", date: "18 Apr 2025", status: "Selesai", amount: "Rp 450.000" },
  { id: "ORD-3717", customer: "Hendro Purnomo", date: "17 Apr 2025", status: "Selesai", amount: "Rp 180.000" }
];

// Example recent users data
const recentUsers = [
  { name: "Anita Wijaya", email: "anita@example.com", date: "20 Apr 2025", status: "Active" },
  { name: "Rudi Hartono", email: "rudi@example.com", date: "19 Apr 2025", status: "Active" },
  { name: "Maya Indah", email: "maya@example.com", date: "18 Apr 2025", status: "Active" },
  { name: "Doni Kusuma", email: "doni@example.com", date: "17 Apr 2025", status: "Inactive" },
  { name: "Linda Sari", email: "linda@example.com", date: "16 Apr 2025", status: "Active" }
];

export default function AdminDashboardPage() {
  return (
    <div>
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
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.amount}</td>
                  </tr>
                ))}
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
                {recentUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{user.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
            <h3 className="text-xl font-bold mb-2">Tambah Produk Baru</h3>
            <p className="text-white/80 mb-4">Tambahkan produk tanaman baru ke katalog Anda</p>
            <a 
              href="/admin/products/new" 
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
              href="/admin/blog/new" 
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