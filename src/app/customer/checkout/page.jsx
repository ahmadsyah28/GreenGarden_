"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [invalidVoucher, setInvalidVoucher] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    nomorTelepon: "",
    alamat: "",
    kota: "",
    kodePos: "",
    catatan: "",
    metode_pengiriman: "regular",
    metode_pembayaran: "transfer",
  });
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Fetch user data and cart items
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!isAuthenticated || !user?._id) {
        setError("Silakan login untuk melakukan checkout.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users/${user._id}`);
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || "Gagal mengambil data pengguna");
        }
        const userData = await userResponse.json();
        setFormData((prev) => ({
          ...prev,
          nama: userData.user.name || "",
          email: userData.user.email || "",
          nomorTelepon: userData.user.phone || "",
        }));

        // Fetch cart data
        const cartResponse = await fetch(`/api/cart?userId=${user._id}`);
        if (!cartResponse.ok) {
          const errorData = await cartResponse.json();
          throw new Error(errorData.error || "Gagal mengambil keranjang");
        }
        const cartData = await cartResponse.json();
        setCartItems(Array.isArray(cartData) ? cartData : []);
      } catch (err) {
        setError(err.message);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, authLoading]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.harga * item.quantity, 0);
  };

  // Calculate shipping cost
  const shippingCost = formData.metode_pengiriman === "regular" ? 20000 : 45000;

  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() - voucherDiscount + shippingCost;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Apply voucher
  const applyVoucher = () => {
    if (voucherCode === "DISKON10") {
      const discount = calculateSubtotal() * 0.1; // 10% discount
      setVoucherDiscount(discount);
      setVoucherApplied(true);
      setInvalidVoucher(false);
    } else if (voucherCode === "GREENGARDEN") {
      const discount = 50000; // Fixed Rp 50,000 discount
      setVoucherDiscount(discount);
      setVoucherApplied(true);
      setInvalidVoucher(false);
    } else {
      setInvalidVoucher(true);
      setVoucherApplied(false);
      setVoucherDiscount(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert("Silakan login untuk melanjutkan pembayaran.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong.");
      return;
    }

    if (
      !formData.nama ||
      !formData.email ||
      !formData.nomorTelepon ||
      !formData.alamat ||
      !formData.kota ||
      !formData.kodePos
    ) {
      alert("Harap isi semua kolom yang wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cartItems.map((item) => ({
            type: item.type,
            itemId: item.itemId,
            optionId: item.optionId,
            nama: item.nama,
            harga: item.harga,
            quantity: item.quantity,
            image: item.image,
            size: item.size,
            additionalServices: item.additionalServices,
          })),
          shippingInfo: {
            nama: formData.nama,
            email: formData.email,
            nomorTelepon: formData.nomorTelepon,
            alamat: formData.alamat,
            kota: formData.kota,
            kodePos: formData.kodePos,
            catatan: formData.catatan,
          },
          shippingMethod: formData.metode_pengiriman,
          shippingCost,
          paymentMethod: formData.metode_pembayaran,
          subtotal: calculateSubtotal(),
          voucherDiscount,
          total: calculateTotal(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      // Clear cart
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, clearAll: true }),
      });

      alert("Pesanan Anda telah diterima! Terima kasih telah berbelanja.");
      router.push(`/customer/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      console.error("Error creating order:", err);
      alert(`Gagal membuat pesanan: ${err.message}`);
    }
  };

  // Format price to Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

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
          href="/customer/keranjang"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke Keranjang
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-[77px] py-8 bg-white">
      {/* Header */}
      <div className="flex items-center mb-8 pl-5">
        <Link href="/customer/keranjang" className="mr-4 text-[#50806B]">
          <FaArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#404041]">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Checkout */}
        <div className="w-full lg:w-7/12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#404041] mb-6">Informasi Pengiriman</h2>
            <div className="mb-4">
              <label htmlFor="nama" className="block text-gray-700 font-medium mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="nomorTelepon"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="nomorTelepon"
                  name="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="alamat" className="block text-gray-700 font-medium mb-2">
                Alamat Lengkap
              </label>
              <textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B] h-24"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="kota" className="block text-gray-700 font-medium mb-2">
                  Kota
                </label>
                <input
                  type="text"
                  id="kota"
                  name="kota"
                  value={formData.kota}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                  required
                />
              </div>
              <div>
                <label htmlFor="kodePos" className="block text-gray-700 font-medium mb-2">
                  Kode Pos
                </label>
                <input
                  type="text"
                  id="kodePos"
                  name="kodePos"
                  value={formData.kodePos}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="catatan" className="block text-gray-700 font-medium mb-2">
                Catatan (opsional)
              </label>
              <textarea
                id="catatan"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B] h-24"
                placeholder="Catatan tambahan untuk pesanan Anda..."
              ></textarea>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#404041] mb-4">
                Metode Pengiriman
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#50806B] transition">
                  <input
                    type="radio"
                    name="metode_pengiriman"
                    value="regular"
                    checked={formData.metode_pengiriman === "regular"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-[#404041]">Pengiriman Reguler</p>
                    <p className="text-sm text-gray-500">Estimasi 3-5 hari kerja</p>
                  </div>
                  <span className="ml-auto font-medium">{formatPrice(20000)}</span>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#50806B] transition">
                  <input
                    type="radio"
                    name="metode_pengiriman"
                    value="express"
                    checked={formData.metode_pengiriman === "express"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-[#404041]">Pengiriman Express</p>
                    <p className="text-sm text-gray-500">Estimasi 1-2 hari kerja</p>
                  </div>
                  <span className="ml-auto font-medium">{formatPrice(45000)}</span>
                </label>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#404041] mb-4">
                Metode Pembayaran
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#50806B] transition">
                  <input
                    type="radio"
                    name="metode_pembayaran"
                    value="transfer"
                    checked={formData.metode_pembayaran === "transfer"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <FaCreditCard className="text-[#50806B] mr-3 text-lg" />
                  <div>
                    <p className="font-medium text-[#404041]">Transfer Bank</p>
                    <p className="text-sm text-gray-500">BCA, Mandiri, BNI, BRI</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#50806B] transition">
                  <input
                    type="radio"
                    name="metode_pembayaran"
                    value="ewallet"
                    checked={formData.metode_pembayaran === "ewallet"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <FaWallet className="text-[#50806B] mr-3 text-lg" />
                  <div>
                    <p className="font-medium text-[#404041]">E-Wallet</p>
                    <p className="text-sm text-gray-500">OVO, GoPay, DANA, LinkAja</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#50806B] transition">
                  <input
                    type="radio"
                    name="metode_pembayaran"
                    value="cod"
                    checked={formData.metode_pembayaran === "cod"}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <FaMoneyBillWave className="text-[#50806B] mr-3 text-lg" />
                  <div>
                    <p className="font-medium text-[#404041]">Bayar di Tempat (COD)</p>
                    <p className="text-sm text-gray-500">Bayar ketika barang sampai di tujuan</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="w-full lg:w-5/12">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-[#404041] mb-6">
              Ringkasan Pesanan
            </h2>
            <div className="border-b pb-4 mb-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.itemId}-${item.type}-${item.optionId || ""}`}
                  className="flex items-center mb-4"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-[#404041] font-medium">{item.nama}</h3>
                    <p className="text-gray-500 text-sm">
                      {item.quantity} x {formatPrice(item.harga)}
                    </p>
                    {item.type === "maintenance" && item.size && (
                      <p className="text-gray-500 text-sm">Ukuran: {item.size}</p>
                    )}
                    {item.type === "design" && item.additionalServices?.length > 0 && (
                      <p className="text-gray-500 text-sm">
                        Layanan Tambahan:{" "}
                        {item.additionalServices.map((s) => s.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.harga * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                <p className="text-red-500 text-sm mt-1">Kode voucher tidak valid</p>
              )}
              {voucherApplied && (
                <p className="text-green-500 text-sm mt-1">
                  Voucher berhasil diterapkan!
                </p>
              )}
            </div>
            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between text-[#404041]">
                <span>Subtotal</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Diskon</span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#404041]">
                <span>Pengiriman</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span className="text-[#404041]">Total</span>
              <span className="text-[#50806B]">{formatPrice(calculateTotal())}</span>
            </div>
            <div>
              <label className="flex items-start mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 mr-3"
                />
                <span className="text-sm text-gray-600">
                  Saya menyetujui{" "}
                  <Link href="/terms" className="text-[#50806B] hover:underline">
                    Syarat dan Ketentuan
                  </Link>{" "}
                  serta{" "}
                  <Link href="/privacy" className="text-[#50806B] hover:underline">
                    Kebijakan Privasi
                  </Link>{" "}
                  yang berlaku.
                </span>
              </label>
              <button
                onClick={handleSubmit}
                className="block w-full bg-[#50806B] text-white text-center py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;