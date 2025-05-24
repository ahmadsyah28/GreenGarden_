"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle, FaDownload, FaHome, FaShoppingBag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CheckoutSuccessPage = ({ searchParams }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const router = useRouter();

  // Ambil orderId dari searchParams saat komponen dimuat
  useEffect(() => {
    setOrderId(searchParams.orderId || null);
  }, [searchParams]);

  // Ambil data pesanan dari API
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Nomor pesanan tidak ditemukan.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mengambil detail pesanan');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Format harga ke Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format tanggal ke format Indonesia
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  };

  // Hitung estimasi pengiriman
  const calculateEstimatedDelivery = (createdAt, shippingMethod) => {
    const daysToAdd = shippingMethod === 'express' ? 2 : 5; // Express: 2 hari, Regular: 5 hari
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta',
    });
  };

  // Format metode pembayaran
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'transfer':
        return 'Transfer Bank BCA';
      case 'ewallet':
        return 'E-Wallet';
      case 'cod':
        return 'Bayar di Tempat (COD)';
      default:
        return 'Tidak Diketahui';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-white text-center">
        <p className="text-red-500">{error || 'Pesanan tidak ditemukan.'}</p>
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
    <div className="container mx-auto px-4 py-10 max-w-4xl bg-white">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
        {/* Ikon Sukses & Pesan */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#404041] mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Green Garden. Pesanan Anda telah kami terima dan sedang diproses.
          </p>
        </div>

        {/* Detail Pesanan */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Detail Pesanan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Nomor Pesanan:</p>
              <p className="font-semibold text-[#404041]">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal Pesanan:</p>
              <p className="font-semibold text-[#404041]">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Metode Pembayaran:</p>
              <p className="font-semibold text-[#404041]">{formatPaymentMethod(order.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Pembayaran:</p>
              <p className="font-semibold text-[#50806B]">{formatPrice(order.total)}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Estimasi Pengiriman:</p>
            <p className="font-semibold text-[#404041]">
              {calculateEstimatedDelivery(order.createdAt, order.shippingMethod)}
            </p>
          </div>
        </div>

        {/* Instruksi Pembayaran (jika transfer atau e-wallet) */}
        {['transfer', 'ewallet'].includes(order.paymentMethod) && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-[#404041] mb-4">Instruksi Pembayaran</h2>

            <div className="flex items-start mb-4">
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={order.paymentMethod === 'transfer' ? '/images/bank-bca.png' : '/images/ewallet.png'}
                  alt={order.paymentMethod === 'transfer' ? 'BCA' : 'E-Wallet'}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                {order.paymentMethod === 'transfer' ? (
                  <>
                    <p className="font-semibold text-[#404041]">Bank BCA</p>
                    <p className="text-gray-600 mb-1">Nomor Rekening: 1234567890</p>
                    <p className="text-gray-600">Atas Nama: PT Green Garden Indonesia</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-[#404041]">E-Wallet</p>
                    <p className="text-gray-600 mb-1">Nomor: 081234567890</p>
                    <p className="text-gray-600">Atas Nama: PT Green Garden Indonesia</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Harap selesaikan pembayaran Anda dalam waktu <span className="font-semibold">24 jam</span> untuk memastikan pesanan Anda diproses.
              </p>
              <p className="text-sm text-gray-600">
                Setelah melakukan pembayaran, konfirmasi dengan mengirimkan bukti transfer ke WhatsApp:{' '}
                <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">
                  081234567890
                </a>{' '}
                atau email:{' '}
                <a href="mailto:orders@greengarden.com" className="text-[#50806B] hover:underline">
                  orders@greengarden.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Informasi & Kontak */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Informasi Penting</h2>

          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Email konfirmasi telah dikirim ke {order.shippingInfo.email}.</li>
            <li>Anda akan menerima notifikasi saat pesanan Anda dikirim.</li>
            <li>
              Untuk pertanyaan atau bantuan, hubungi{' '}
              <a href="mailto:cs@greengarden.com" className="text-[#50806B] hover:underline">
                cs@greengarden.com
              </a>{' '}
              atau WhatsApp ke{' '}
              <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">
                081234567890
              </a>
            </li>
          </ul>
        </div>

        {/* Tombol Aksi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center justify-center bg-white border border-[#50806B] text-[#50806B] px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            onClick={() => alert('Fitur unduh invoice belum diimplementasikan.')}
          >
            <FaDownload className="mr-2" />
            Unduh Invoice
          </button>

          <Link
            href="/account/orders"
            className="flex items-center justify-center bg-white border border-[#50806B] text-[#50806B] px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            <FaShoppingBag className="mr-2" />
            Lihat Pesanan
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center bg-[#50806B] text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
          >
            <FaHome className="mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Rekomendasi Produk (Opsional) */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#404041] mb-6 text-center">Rekomendasi untuk Anda</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Produk 1 */}
          <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src="/images/tanaman/tanaman3.png"
                alt="Syngonium Rayii"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#404041] mb-1">Syngonium Rayii</h3>
              <p className="text-[#50806B] font-medium mb-3">Rp 25.000</p>
              <button className="w-full bg-[#50806B] text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          {/* Produk 2 */}
          <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src="/images/tanaman/tanaman4.png"
                alt="Pineapple"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#404041] mb-1">Pineapple</h3>
              <p className="text-[#50806B] font-medium mb-3">Rp 20.000</p>
              <button className="w-full bg-[#50806B] text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          {/* Produk 3 */}
          <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src="/images/tanaman/tanaman7.png"
                alt="Chinese Evergreen"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#404041] mb-1">Chinese Evergreen</h3>
              <p className="text-[#50806B] font-medium mb-3">Rp 75.000</p>
              <button className="w-full bg-[#50806B] text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                Tambah ke Keranjang
              </button>
            </div>
          </div>

          {/* Produk 4 */}
          <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src="/images/tanaman/tanaman8.png"
                alt="Aglonema Red"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#404041] mb-1">Aglonema Red</h3>
              <p className="text-[#50806B] font-medium mb-3">Rp 45.000</p>
              <button className="w-full bg-[#50806B] text-white py-2 rounded-lg hover:bg-opacity-90 transition">
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;