"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle, FaDownload, FaHome, FaShoppingBag } from 'react-icons/fa';

const CheckoutSuccessPage = () => {
  // Informasi pesanan
  const orderInfo = {
    orderNumber: "GG-" + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    paymentMethod: "Transfer Bank BCA",
    totalAmount: 1590000, // Rp 1.590.000
    estimatedDelivery: new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) // 3 hari dari sekarang
  };

  // Format harga ke Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl bg-white">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#404041] mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Green Garden.
            Pesanan Anda telah kami terima dan sedang diproses.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Detail Pesanan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Nomor Pesanan:</p>
              <p className="font-semibold text-[#404041]">{orderInfo.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal Pesanan:</p>
              <p className="font-semibold text-[#404041]">{orderInfo.orderDate}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Metode Pembayaran:</p>
              <p className="font-semibold text-[#404041]">{orderInfo.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Pembayaran:</p>
              <p className="font-semibold text-[#50806B]">{formatPrice(orderInfo.totalAmount)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-gray-600">Estimasi Pengiriman:</p>
            <p className="font-semibold text-[#404041]">{orderInfo.estimatedDelivery}</p>
          </div>
        </div>

        {/* Payment Instructions (if using bank transfer) */}
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Instruksi Pembayaran</h2>
          
          <div className="flex items-start mb-4">
            <div className="relative w-12 h-12 mr-4">
              <Image
                src="/images/bank-bca.png"
                alt="BCA"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-[#404041]">Bank BCA</p>
              <p className="text-gray-600 mb-1">Nomor Rekening: 1234567890</p>
              <p className="text-gray-600">Atas Nama: PT Green Garden Indonesia</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Harap selesaikan pembayaran Anda dalam waktu <span className="font-semibold">24 jam</span> untuk memastikan pesanan Anda diproses.
            </p>
            <p className="text-sm text-gray-600">
              Setelah melakukan pembayaran, konfirmasi dengan mengirimkan bukti transfer ke WhatsApp: <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">081234567890</a> atau email: <a href="mailto:orders@greengarden.com" className="text-[#50806B] hover:underline">orders@greengarden.com</a>
            </p>
          </div>
        </div>

        {/* Info & Contact */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Informasi Penting</h2>
          
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Email konfirmasi telah dikirim ke alamat email Anda.</li>
            <li>Anda akan menerima notifikasi saat pesanan Anda dikirim.</li>
            <li>Untuk pertanyaan atau bantuan, hubungi <a href="mailto:cs@greengarden.com" className="text-[#50806B] hover:underline">cs@greengarden.com</a> atau WhatsApp ke <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">081234567890</a></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center bg-white border border-[#50806B] text-[#50806B] px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            <FaDownload className="mr-2" />
            Unduh Invoice
          </button>
          
          <Link href="/account/orders" className="flex items-center justify-center bg-white border border-[#50806B] text-[#50806B] px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            <FaShoppingBag className="mr-2" />
            Lihat Pesanan
          </Link>
          
          <Link href="/" className="flex items-center justify-center bg-[#50806B] text-white px-4 py-3 rounded-lg font-medium hover:bg-opacity-90 transition">
            <FaHome className="mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
      
      {/* Similar Products Recommendations (Optional) */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#404041] mb-6 text-center">Rekomendasi untuk Anda</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product 1 */}
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
          
          {/* Product 2 */}
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
          
          {/* Product 3 */}
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
          
          {/* Product 4 */}
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