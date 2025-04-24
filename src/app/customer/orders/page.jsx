"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown, FaAngleUp, FaArrowLeft, FaCircle, FaSearch, FaFileInvoice, FaRegComment } from 'react-icons/fa';

// Data pesanan dummy
const orderData = [
  {
    id: "GG-234567",
    date: "23 April 2025",
    status: "Dikirim",
    total: 1590000,
    items: [
      {
        id: 1,
        name: "Marble Queen",
        qty: 2,
        price: 20000,
        image: "/images/tanaman/tanaman1.png"
      },
      {
        id: 2,
        name: "Neon Pothos",
        qty: 1,
        price: 30000,
        image: "/images/tanaman/tanaman2.png"
      },
      {
        id: 5,
        name: "Taman Minimalis Modern",
        qty: 1,
        price: 1500000,
        image: "/images/desain/desain1.png"
      }
    ],
    tracking: {
      courier: "JNE",
      trackingNumber: "JP76543210987",
      updates: [
        { date: "23 April 2025, 10:30", status: "Paket dikirim dari gudang Green Garden" },
        { date: "23 April 2025, 14:15", status: "Paket telah diterima di hub sortir" },
        { date: "23 April 2025, 18:45", status: "Paket dalam perjalanan ke alamat tujuan" }
      ]
    },
    paymentMethod: "Transfer Bank BCA",
    shippingAddress: "Jl. Mawar No. 10, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat, 16415"
  },
  {
    id: "GG-123456",
    date: "15 April 2025",
    status: "Selesai",
    total: 95000,
    items: [
      {
        id: 3,
        name: "Syngonium Rayii",
        qty: 2,
        price: 25000,
        image: "/images/tanaman/tanaman3.png"
      },
      {
        id: 4,
        name: "Pineapple",
        qty: 1,
        price: 20000,
        image: "/images/tanaman/tanaman4.png"
      },
      {
        id: 8,
        name: "Aglonema Red",
        qty: 1,
        price: 45000,
        image: "/images/tanaman/tanaman8.png"
      }
    ],
    tracking: {
      courier: "JNE",
      trackingNumber: "JP12345678",
      updates: [
        { date: "15 April 2025, 09:15", status: "Paket dikirim dari gudang Green Garden" },
        { date: "15 April 2025, 13:45", status: "Paket telah diterima di hub sortir" },
        { date: "16 April 2025, 10:30", status: "Paket dalam perjalanan ke alamat tujuan" },
        { date: "17 April 2025, 14:20", status: "Paket telah tiba di alamat tujuan" }
      ]
    },
    paymentMethod: "DANA",
    shippingAddress: "Jl. Mawar No. 10, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat, 16415"
  },
  {
    id: "GG-987654",
    date: "5 April 2025",
    status: "Dibatalkan",
    total: 40000,
    items: [
      {
        id: 6,
        name: "Pothos",
        qty: 1,
        price: 40000,
        image: "/images/tanaman/tanaman6.png"
      }
    ],
    tracking: null,
    paymentMethod: "Transfer Bank BCA",
    shippingAddress: "Jl. Mawar No. 10, Kel. Sukamaju, Kec. Cilodong, Kota Depok, Jawa Barat, 16415",
    cancellationReason: "Stok habis"
  }
];

// Status color mapping
const statusColors = {
  "Menunggu Pembayaran": "text-yellow-500",
  "Diproses": "text-blue-500",
  "Dikirim": "text-purple-500",
  "Selesai": "text-green-500",
  "Dibatalkan": "text-red-500"
};

// Format price to IDR
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Order Header */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
        <div className="flex items-center">
          <FaCircle className={`${statusColors[order.status]} text-xs mr-2`} />
          <span className="font-medium">{order.status}</span>
        </div>
      </div>

      {/* Order Preview */}
      <div className="p-4 border-b flex flex-wrap justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center mb-2 md:mb-0">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="relative w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="ml-4">
            <p className="font-medium">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
            <p className="text-[#50806B] font-semibold">{formatPrice(order.total)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={toggleExpand}
            className="flex items-center text-[#50806B] hover:underline"
          >
            {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
            {isExpanded ? <FaAngleUp className="ml-1" /> : <FaAngleDown className="ml-1" />}
          </button>
        </div>
      </div>

      {/* Order Details (expanded) */}
      {isExpanded && (
        <div className="p-4">
          {/* Products */}
          <div className="mb-6">
            <h3 className="font-medium text-[#404041] mb-3">Produk</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium text-[#404041]">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.qty} x {formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-[#404041] mb-2">Informasi Pengiriman</h3>
              <p className="text-sm text-gray-600 mb-2">Alamat Pengiriman:</p>
              <p className="text-sm text-gray-800 mb-3">{order.shippingAddress}</p>
              
              {order.tracking && (
                <>
                  <p className="text-sm text-gray-600 mb-1">Kurir: {order.tracking.courier}</p>
                  <p className="text-sm text-gray-600">No. Resi: {order.tracking.trackingNumber}</p>
                </>
              )}
            </div>
            <div>
              <h3 className="font-medium text-[#404041] mb-2">Informasi Pembayaran</h3>
              <p className="text-sm text-gray-600 mb-2">Metode Pembayaran:</p>
              <p className="text-sm text-gray-800 mb-3">{order.paymentMethod}</p>
              
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Pembayaran:</p>
                <p className="text-sm text-gray-800 font-medium">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking && (
            <div className="mb-6">
              <h3 className="font-medium text-[#404041] mb-3">Status Pengiriman</h3>
              <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                {order.tracking.updates.map((update, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[0.5rem] w-4 h-4 rounded-full bg-white border-2 border-[#50806B]"></div>
                    <p className="text-sm font-medium text-[#404041]">{update.status}</p>
                    <p className="text-xs text-gray-500">{update.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          {order.status === "Dibatalkan" && (
            <div className="mb-6">
              <h3 className="font-medium text-[#404041] mb-2">Alasan Pembatalan</h3>
              <p className="text-sm text-gray-800">{order.cancellationReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {order.status === "Dikirim" && (
              <button className="bg-[#50806B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                Konfirmasi Penerimaan
              </button>
            )}
            
            {order.status === "Selesai" && (
             <Link 
             href="/customer/reviews/" 
             className="bg-[#50806B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
           >
             Beri Ulasan
           </Link>
            )}
            
            <button className="flex items-center bg-white border border-[#50806B] text-[#50806B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              <FaFileInvoice className="mr-2" />
              Lihat Invoice
            </button>
            
            <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              <FaRegComment className="mr-2" />
              Hubungi CS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter orders based on tab and search query
  const filteredOrders = orderData.filter(order => {
    // Filter by tab
    if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab) {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/account" className="flex items-center text-[#50806B] hover:underline mr-4">
          <FaArrowLeft className="mr-2" />
          Kembali ke Akun
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#404041]">Pesanan Saya</h1>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            Semua
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'menunggu pembayaran' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('menunggu pembayaran')}
          >
            Menunggu Pembayaran
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'diproses' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('diproses')}
          >
            Diproses
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'dikirim' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dikirim')}
          >
            Dikirim
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'selesai' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('selesai')}
          >
            Selesai
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'dibatalkan' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dibatalkan')}
          >
            Dibatalkan
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari order ID atau nama produk"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Order List */}
      <div>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#404041] mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki pesanan atau tidak ada pesanan yang sesuai dengan filter.</p>
            <Link href="/" className="inline-block bg-[#50806B] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;