"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

const KeranjangPage = () => {
  // State untuk menyimpan item keranjang
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      nama: 'Marble Queen',
      harga: 20000,
      quantity: 2,
      image: '/images/tanaman/tanaman1.png',
      type: 'Tanaman Hias'
    },
    {
      id: 2,
      nama: 'Neon Pothos',
      harga: 30000,
      quantity: 1,
      image: '/images/tanaman/tanaman2.png',
      type: 'Tanaman Hias'
    },
    {
      id: 5,
      nama: 'Taman Minimalis Modern',
      harga: 1500000,
      quantity: 1,
      image: '/images/desain/desain1.png',
      type: 'Desain Taman'
    }
  ]);

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [invalidVoucher, setInvalidVoucher] = useState(false);

  // Menghitung subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.harga * item.quantity), 0);
  };

  // Menghitung total setelah diskon
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - voucherDiscount;
  };

  // Menambah jumlah item
  const increaseQuantity = (id) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Mengurangi jumlah item
  const decreaseQuantity = (id) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Menghapus item dari keranjang
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Menerapkan voucher
  const applyVoucher = () => {
    // Contoh validasi voucher sederhana
    if (voucherCode === 'DISKON10') {
      const discount = calculateSubtotal() * 0.1; // Diskon 10%
      setVoucherDiscount(discount);
      setVoucherApplied(true);
      setInvalidVoucher(false);
    } else if (voucherCode === 'GREENGARDEN') {
      const discount = 50000; // Diskon tetap Rp 50.000
      setVoucherDiscount(discount);
      setVoucherApplied(true);
      setInvalidVoucher(false);
    } else {
      setInvalidVoucher(true);
      setVoucherApplied(false);
      setVoucherDiscount(0);
    }
  };

  // Format harga ke format Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Apakah keranjang kosong
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#404041]">Keranjang Belanja</h1>
      </div>

      {isCartEmpty ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#404041] mb-4">Keranjang Anda Kosong</h2>
          <p className="text-gray-600 mb-8">Mulai belanja untuk menambahkan produk ke keranjang Anda.</p>
          <Link href="/" className="inline-block bg-[#50806B] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition">
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Daftar produk */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Produk</th>
                    <th className="text-center py-4">Jumlah</th>
                    <th className="text-right py-4">Subtotal</th>
                    <th className="text-right py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={item.image}
                              alt={item.nama}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-[#404041] font-semibold">{item.nama}</h3>
                            <p className="text-gray-500 text-sm">{item.type}</p>
                            <p className="text-[#50806B] font-medium">{formatPrice(item.harga)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="mx-3 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.id)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium">
                        {formatPrice(item.harga * item.quantity)}
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Hapus item"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ringkasan Belanja */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#404041] mb-6">Ringkasan Belanja</h2>
              
              {/* Subtotal */}
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>
              
              {/* Kode Voucher */}
              <div className="mb-4">
                <label htmlFor="voucher" className="block text-gray-600 mb-2">Kode Voucher</label>
                <div className="flex">
                  <input
                    type="text"
                    id="voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                    placeholder="Masukkan kode voucher"
                  />
                  <button
                    onClick={applyVoucher}
                    className="bg-[#50806B] text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition"
                  >
                    Terapkan
                  </button>
                </div>
                {invalidVoucher && (
                  <p className="text-red-500 text-sm mt-1">Kode voucher tidak valid</p>
                )}
                {voucherApplied && (
                  <p className="text-green-500 text-sm mt-1">Voucher berhasil diterapkan!</p>
                )}
              </div>
              
              {/* Diskon */}
              {voucherApplied && (
                <div className="flex justify-between mb-4 text-green-500">
                  <span>Diskon</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              
              {/* Total */}
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span className="text-[#404041]">Total</span>
                <span className="text-[#50806B]">{formatPrice(calculateTotal())}</span>
              </div>
              
              {/* Checkout Button */}
              <Link
                href="/customer/checkout"
                className="block w-full bg-[#50806B] text-white text-center py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
              >
                Lanjutkan ke Pembayaran
              </Link>
              
              {/* Atau Lanjut Belanja */}
              <Link
                href="/"
                className="block w-full text-[#50806B] text-center py-3 rounded-lg font-medium mt-3 border border-[#50806B] hover:bg-gray-50 transition"
              >
                Lanjutkan Belanja
              </Link>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default KeranjangPage;