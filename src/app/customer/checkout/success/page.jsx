"use client";

import React, { useState, useEffect, useContext, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaDownload, FaHome, FaShoppingBag } from "react-icons/fa";
import { jsPDF } from "jspdf";
import AuthContext from "@/context/AuthContext";

// Safe Image Component with Error Handling
const SafeImage = ({ src, alt, className, fill, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/images/placeholder.png');
    }
  };

  if (!src || hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${fill ? 'absolute inset-0' : 'w-full h-full'}`}>
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      onError={handleError}
      {...props}
    />
  );
};

// Loading Component
const LoadingComponent = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl bg-white text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
      <p className="text-gray-600 mt-4">Memuat halaman...</p>
    </div>
  );
};

// Main Content Component yang menggunakan useSearchParams
const CheckoutSuccessContent = () => {
  const [order, setOrder] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user } = useContext(AuthContext);

  // Fetch order details and recommended items
  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) {
        setError("Nomor pesanan tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`);
        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.error || "Gagal mengambil detail pesanan");
        }
        const orderData = await orderResponse.json();
        setOrder(orderData.order);

        // Fetch recommended plants (limit to 4)
        try {
          const plantsResponse = await fetch("/api/plants?limit=4");
          if (plantsResponse.ok) {
            const plantsData = await plantsResponse.json();
            setRecommendedItems(plantsData.plants || []);
          }
        } catch (plantError) {
          console.warn("Failed to fetch recommendations:", plantError);
          setRecommendedItems([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Format price to Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date to Indonesian format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  // Calculate estimated delivery
  const calculateEstimatedDelivery = (createdAt, shippingMethod) => {
    const daysToAdd = shippingMethod === "express" ? 2 : 5;
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });
  };

  // Format payment method
  const formatPaymentMethod = (method) => {
    switch (method) {
      case "transfer":
        return "Transfer Bank BCA";
      case "ewallet":
        return "E-Wallet (OVO, GoPay, DANA, LinkAja)";
      case "cod":
        return "Bayar di Tempat (COD)";
      default:
        return "Tidak Diketahui";
    }
  };

  // Generate and download invoice as PDF
  const downloadInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Invoice Pesanan - Green Garden", 20, 20);
    doc.setFontSize(12);
    doc.text(`Nomor Pesanan: ${order._id}`, 20, 30);
    doc.text(`Tanggal: ${formatDate(order.createdAt)}`, 20, 36);
    doc.text(`Nama: ${order.shippingInfo.nama}`, 20, 42);
    doc.text(`Alamat: ${order.shippingInfo.alamat}, ${order.shippingInfo.kota} ${order.shippingInfo.kodePos}`, 20, 48);

    doc.setFontSize(14);
    doc.text("Detail Pesanan", 20, 60);
    let y = 70;
    order.items.forEach((item, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${item.nama}`, 20, y);
      doc.text(`Jumlah: ${item.quantity}`, 120, y);
      doc.text(formatPrice(item.harga * item.quantity), 160, y);
      y += 6;
      if (item.type === "maintenance" && item.size) {
        doc.text(`Ukuran: ${item.size}`, 25, y);
        y += 6;
      }
      if (item.type === "design" && item.additionalServices?.length > 0) {
        doc.text(`Layanan Tambahan: ${item.additionalServices.map(s => s.name).join(", ")}`, 25, y);
        y += 6;
      }
    });

    doc.text(`Subtotal: ${formatPrice(order.subtotal)}`, 20, y);
    y += 6;
    if (order.voucherDiscount > 0) {
      doc.text(`Diskon: -${formatPrice(order.voucherDiscount)}`, 20, y);
      y += 6;
    }
    doc.text(`Pengiriman: ${formatPrice(order.shippingCost)}`, 20, y);
    y += 6;
    doc.setFontSize(14);
    doc.text(`Total: ${formatPrice(order.total)}`, 20, y);

    doc.save(`invoice_${order._id}.pdf`);
  };

  // Handle add to cart for recommended items
  const addToCart = async (plantId) => {
    if (!user) {
      alert("Silakan login untuk menambahkan ke keranjang");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "plant",
          itemId: plantId,
          quantity: 1,
          userId: user._id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menambahkan ke keranjang");
      }
      
      alert("Produk ditambahkan ke keranjang!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(`Gagal menambahkan ke keranjang: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
        <p className="text-gray-600 mt-4">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-white text-center">
        <p className="text-red-500 text-lg font-semibold">{error || "Pesanan tidak ditemukan."}</p>
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
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#404041] mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Green Garden. Pesanan Anda telah kami terima dan sedang diproses.
          </p>
        </div>

        {/* Order Details */}
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
            <div>
              <p className="text-gray-600">Metode Pembayaran:</p>
              <p className="font-semibold text-[#404041]">{formatPaymentMethod(order.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Pembayaran:</p>
              <p className="font-semibold text-[#50806B]">{formatPrice(order.total)}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimasi Pengiriman:</p>
              <p className="font-semibold text-[#404041]">
                {calculateEstimatedDelivery(order.createdAt, order.shippingMethod)}
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mt-4">
            <p className="text-gray-600 font-semibold">Informasi Pengiriman:</p>
            <p className="text-[#404041]">
              {order.shippingInfo.nama}<br />
              {order.shippingInfo.alamat}, {order.shippingInfo.kota}, {order.shippingInfo.kodePos}<br />
              {order.shippingInfo.nomorTelepon}<br />
              {order.shippingInfo.email}
            </p>
            {order.shippingInfo.catatan && (
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Catatan:</span> {order.shippingInfo.catatan}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Item Pesanan</h2>
          {order.items.map((item) => (
            <div
              key={`${item.itemId}-${item.type}-${item.optionId || ""}`}
              className="flex items-center mb-4 border-b pb-4"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                <SafeImage
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
                    Layanan Tambahan: {item.additionalServices.map((s) => s.name).join(", ")}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.harga * item.quantity)}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[#404041]">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.voucherDiscount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Diskon</span>
                <span>-{formatPrice(order.voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#404041]">
              <span>Pengiriman</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#50806B]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions - No Icons/Images */}
        {["transfer", "ewallet"].includes(order.paymentMethod) && (
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-[#404041] mb-4">Instruksi Pembayaran</h2>
            <div className="mb-4">
              {order.paymentMethod === "transfer" ? (
                <>
                  <p className="font-semibold text-[#404041] mb-2">Transfer Bank BCA</p>
                  <p className="text-gray-600 mb-1">Nomor Rekening: 1234567890</p>
                  <p className="text-gray-600">Atas Nama: PT Green Garden Indonesia</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[#404041] mb-2">E-Wallet</p>
                  <p className="text-gray-600 mb-1">Nomor: 081234567890</p>
                  <p className="text-gray-600">Atas Nama: PT Green Garden Indonesia</p>
                </>
              )}
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Harap selesaikan pembayaran dalam waktu <span className="font-semibold">24 jam</span> untuk memastikan pesanan diproses.
              </p>
              <p className="text-sm text-gray-600">
                Konfirmasi pembayaran ke WhatsApp:{" "}
                <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">
                  081234567890
                </a>{" "}
                atau email:{" "}
                <a href="mailto:orders@greengarden.com" className="text-[#50806B] hover:underline">
                  orders@greengarden.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#404041] mb-4">Informasi Penting</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Email konfirmasi telah dikirim ke {order.shippingInfo.email}.</li>
            <li>Notifikasi akan dikirim saat pesanan Anda dikirim.</li>
            <li>
              Hubungi kami di{" "}
              <a href="mailto:cs@greengarden.com" className="text-[#50806B] hover:underline">
                cs@greengarden.com
              </a>{" "}
              atau WhatsApp{" "}
              <a href="https://wa.me/6281234567890" className="text-[#50806B] hover:underline">
                081234567890
              </a>{" "}
              untuk bantuan.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={downloadInvoice}
            className="flex items-center justify-center bg-white border border-[#50806B] text-[#50806B] px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
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

      {/* Recommended Products */}
      {recommendedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[#404041] mb-6 text-center">
            Rekomendasi untuk Anda
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedItems.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-48">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#404041] mb-1">{item.name}</h3>
                  <p className="text-[#50806B] font-medium mb-3">{formatPrice(item.price)}</p>
                  <button
                    onClick={() => addToCart(item._id)}
                    className="w-full bg-[#50806B] text-white py-2 rounded-lg hover:bg-opacity-90 transition"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component dengan Suspense wrapper
const CheckoutSuccessPage = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
};

export default CheckoutSuccessPage;