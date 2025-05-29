"use client";

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaAngleDown, FaAngleUp, FaArrowLeft, FaCircle, FaSearch, FaFileInvoice, FaRegComment } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Status color mapping
const statusColors = {
  pending: 'text-yellow-500',
  processing: 'text-blue-500',
  shipped: 'text-purple-500',
  selesai: 'text-green-500',
  cancelled: 'text-red-500',
};

// Status display mapping
const statusDisplay = {
  pending: 'Menunggu Pembayaran',
  processing: 'Diproses',
  shipped: 'Dikirim',
  selesai: 'Selesai',
  cancelled: 'Dibatalkan',
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

  // Format tanggal dari createdAt
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Order Header */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order ID: {order._id}</p>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center">
          <FaCircle className={`${statusColors[order.status]} text-xs mr-2`} />
          <span className="font-medium">{statusDisplay[order.status]}</span>
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
                  alt={item.nama}
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
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium text-[#404041]">{item.nama}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.harga)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.harga * item.quantity)}</p>
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
              <p className="text-sm text-gray-800 mb-3">
                {order.shippingInfo.alamat}, {order.shippingInfo.kota}, {order.shippingInfo.kodePos}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[#404041] mb-2">Informasi Pembayaran</h3>
              <p className="text-sm text-gray-600 mb-2">Metode Pembayaran:</p>
              <p className="text-sm text-gray-800 mb-3">
                {order.paymentMethod === 'transfer' ? 'Transfer Bank BCA' : order.paymentMethod === 'ewallet' ? 'E-Wallet' : 'Bayar di Tempat (COD)'}
              </p>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Total Pembayaran:</p>
                <p className="text-sm text-gray-800 font-medium">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          {order.status === 'cancelled' && order.cancellationReason && (
            <div className="mb-6">
              <h3 className="font-medium text-[#404041] mb-2">Alasan Pembatalan</h3>
              <p className="text-sm text-gray-800">{order.cancellationReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {order.status === 'shipped' && (
              <button
                className="bg-[#50806B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
                onClick={() => alert('Fitur konfirmasi penerimaan belum diimplementasikan.')}
              >
                Konfirmasi Penerimaan
              </button>
            )}
            {order.status === 'selesai' && (
              <Link
                href="/customer/reviews/"
                className="bg-[#50806B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
              >
                Beri Ulasan
              </Link>
            )}
            <button
              className="flex items-center bg-white border border-[#50806B] text-[#50806B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              onClick={() => alert('Fitur lihat invoice belum diimplementasikan.')}
            >
              <FaFileInvoice className="mr-2" />
              Lihat Invoice
            </button>
            <button
              className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              onClick={() => alert('Fitur hubungi CS belum diimplementasikan.')}
            >
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  // Ambil data pesanan dari API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setError('Silakan login untuk melihat pesanan Anda.');
        setLoading(false);
        router.push('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/orders?userId=${user._id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mengambil pesanan');
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, router]);

  // Filter pesanan berdasarkan tab dan pencarian
  const filteredOrders = orders.filter((order) => {
    // Filter berdasarkan tab
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(query) ||
        order.items.some((item) => item.nama.toLowerCase().includes(query))
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white text-center">
        <p className="text-red-500">{error}</p>
        <Link
          href="/"
          className="inline-block bg-[#50806B] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition mt-4"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-[#50806B] hover:underline mr-4">
          <FaArrowLeft className="mr-2" />
          Kembali ke Beranda
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
            className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            Menunggu Pembayaran
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'processing' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('processing')}
          >
            Diproses
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'shipped' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('shipped')}
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
            className={`px-4 py-2 font-medium ${activeTab === 'cancelled' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => setActiveTab('cancelled')}
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
            <OrderItem key={order._id} order={order} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#404041] mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 mb-6">Anda belum memiliki pesanan atau tidak ada pesanan yang sesuai dengan filter.</p>
            <Link
              href="/"
              className="inline-block bg-[#50806B] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;