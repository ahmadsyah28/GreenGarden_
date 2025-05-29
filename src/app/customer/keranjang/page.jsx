"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

const KeranjangPage = () => {
 const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [invalidVoucher, setInvalidVoucher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (authLoading) return; // Tunggu autentikasi selesai
      if (!isAuthenticated || !user?._id) {
        setError('Silakan login untuk melihat keranjang.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/cart?userId=${user._id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mengambil keranjang');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user, authLoading]);

  // Menghitung subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.harga * item.quantity,
      0
    );
  };

  // Menghitung total setelah diskon
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - voucherDiscount;
  };

  // Menambah jumlah item
  const increaseQuantity = async (itemId, type, optionId = null) => {
  const item = cartItems.find(
    (item) =>
      item.itemId === itemId &&
      item.type === type &&
      (type !== 'maintenance' || item.optionId === optionId)
  );
  if (!item) return;

  try {
    const response = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        itemId,
        optionId: type === 'maintenance' ? optionId : undefined,
        quantity: item.quantity + 1,
        userId: user._id,
        size: type === 'maintenance' ? item.size : undefined,
        additionalServices: type === 'design' ? item.additionalServices : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal memperbarui jumlah');
    }

    setCartItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.itemId === itemId &&
        prevItem.type === type &&
        (type !== 'maintenance' || prevItem.optionId === optionId)
          ? { ...prevItem, quantity: prevItem.quantity + 1 }
          : prevItem
      )
    );
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};

const decreaseQuantity = async (itemId, type, optionId = null) => {
  const item = cartItems.find(
    (item) =>
      item.itemId === itemId &&
      item.type === type &&
      (type !== 'maintenance' || item.optionId === optionId)
  );
  if (!item || item.quantity <= 1) return;

  try {
    const response = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        itemId,
        optionId: type === 'maintenance' ? optionId : undefined,
        quantity: item.quantity - 1,
        userId: user._id,
        size: type === 'maintenance' ? item.size : undefined,
        additionalServices: type === 'design' ? item.additionalServices : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Gagal memperbarui jumlah');
    }

    setCartItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.itemId === itemId &&
        prevItem.type === type &&
        (type !== 'maintenance' || prevItem.optionId === optionId)
          ? { ...prevItem, quantity: prevItem.quantity - 1 }
          : prevItem
      )
    );
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
};

  // Menghapus item dari keranjang
  const removeItem = async (itemId, type, optionId = null) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          itemId,
          optionId: type === "maintenance" ? optionId : undefined,
          userId: user._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus item");
      }

      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.itemId === itemId &&
              item.type === type &&
              (type !== "maintenance" || item.optionId === optionId)
            )
        )
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Menerapkan voucher
  const applyVoucher = () => {
    if (voucherCode === "DISKON10") {
      const discount = calculateSubtotal() * 0.1; // Diskon 10%
      setVoucherDiscount(discount);
      setVoucherApplied(true);
      setInvalidVoucher(false);
    } else if (voucherCode === "GREENGARDEN") {
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Apakah keranjang kosong
  const isCartEmpty = cartItems.length === 0;

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
          href="/customer/layanan"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke Layanan
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#404041] p-6">
          Keranjang Belanja
        </h1>
      </div>

      {isCartEmpty ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
          <h2 className="text-2xl font-semibold text-[#404041] mb-4">
            Keranjang Anda Kosong
          </h2>
          <p className="text-gray-600 mb-8">
            Mulai belanja untuk menambahkan produk ke keranjang Anda.
          </p>
          <Link
            href="/customer/layanan"
            className="inline-block bg-[#50806B] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition"
          >
            Jelajahi Layanan
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Daftar item */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Item</th>
                    <th className="text-center py-4">Jumlah</th>
                    <th className="text-right py-4">Subtotal</th>
                    <th className="text-right py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={`${item.itemId}-${item.type}-${item.optionId || ""}`} className="border-b">
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
                            <h3 className="text-[#404041] font-semibold">
                              {item.nama}
                            </h3>
                            <p className="text-[#50806B] font-medium">
                              {formatPrice(item.harga)}
                            </p>
                            {item.type === "maintenance" && item.size && (
                              <p className="text-gray-600 text-sm">
                                Ukuran: {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.itemId, item.type, item.optionId)
                            }
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="mx-3 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              increaseQuantity(item.itemId, item.type, item.optionId)
                            }
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            // Tidak ada batasan stok untuk maintenance
                            disabled={item.type === "plant" && item.quantity >= item.stock}
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
                          onClick={() =>
                            removeItem(item.itemId, item.type, item.optionId)
                          }
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
              <h2 className="text-lg font-bold text-[#404041] mb-6">
                Ringkasan Belanja
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
              </div>

              {/* Kode Voucher */}
              <div className="mb-4">
                <label htmlFor="voucher" className="block text-gray-600 mb-2">
                  Kode Voucher
                </label>
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
                  <p className="text-red-500 text-sm mt-1">
                    Kode voucher tidak valid
                  </p>
                )}
                {voucherApplied && (
                  <p className="text-green-500 text-sm mt-1">
                    Voucher berhasil diterapkan!
                  </p>
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
                href="/customer/layanan"
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