// src/app/admin/orders/page.jsx (Updated)
"use client";

import { useState, useEffect, useContext } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";

export default function OrdersManagementPage() {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetails, setShowDetails] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Fetch all orders
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("auth_token="))
                ?.split("=")[1]
            }`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json();
          console.error("Gagal mengambil pesanan:", errorData.error);
          setAlert({
            show: true,
            type: "error",
            message: "Terjadi kesalahan saat mengambil data pesanan",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setAlert({
          show: true,
          type: "error",
          message: "Terjadi kesalahan saat mengambil data pesanan",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("auth_token="))
              ?.split("=")[1]
          }`,
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          adminId: user?._id,
        }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setAlert({
          show: true,
          type: "success",
          message: "Status pesanan berhasil diperbarui!",
        });
      } else {
        const errorData = await response.json();
        setAlert({
          show: true,
          type: "error",
          message: `Gagal memperbarui status: ${errorData.error}`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Terjadi kesalahan saat memperbarui status pesanan.",
      });
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toString().includes(searchTerm);
    const matchesStatus =
      selectedStatus === "Semua" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Auto hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  if (authLoading || loading) {
    return (
      <div className="p-1 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#285A43]"></div>
      </div>
    );
  }

  return (
    <div className="p-1 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Pesanan</h1>
        <p className="text-gray-600 mt-1">
          Lihat dan kelola semua pesanan pelanggan Green Garden
        </p>
      </div>

      {/* Alert */}
      {alert.show && (
        <div
          className={`mb-4 p-3 rounded ${
            alert.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaShoppingCart className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-medium">Total Pesanan</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {orders.length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCheckCircle className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-medium">
                Pesanan Selesai
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {orders.filter((o) => o.status === "selesai").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaCalendarAlt className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-medium">
                Sedang Diproses
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {orders.filter((o) => o.status === "processing").length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaTimesCircle className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-600 text-sm font-medium">
                Pesanan Dibatalkan
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {orders.filter((o) => o.status === "cancelled").length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama pelanggan atau ID pesanan..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43] focus:border-transparent"
          >
            <option value="Semua">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="selesai">Selesai</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode Pembayaran
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.user_id?.name || "User tidak ditemukan"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.user_id?.email || "Email tidak tersedia"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatPrice(order.total_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className={`block w-full py-1 px-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#285A43] focus:border-transparent text-xs ${
                        order.status === "selesai"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="selesai">Selesai</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <button
                      onClick={() => {
                        // Kosong - tidak melakukan apa-apa
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {currentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada pesanan yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details */}
        {showDetails && (
          <div className="p-6 border-t border-gray-200">
            {currentOrders
              .filter((order) => order._id === showDetails)
              .map((order) => (
                <div key={order._id}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Detail Pesanan #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pelanggan
                      </p>
                      <p className="text-gray-900">
                        {order.user_id?.name || "User tidak ditemukan"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.user_id?.email || "Email tidak tersedia"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {order.user_id?.phone || "Phone tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Alamat Pengiriman
                      </p>
                      <p className="text-gray-900">{order.address}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">
                      Item Pesanan
                    </p>
                    <table className="min-w-full divide-y divide-gray-200 mt-2">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipe
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Harga Satuan
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.nama || "Item tidak ditemukan"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.type.replace("_", " ")}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {formatPrice(item.harga)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {formatPrice(item.harga * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  hingga{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredOrders.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{filteredOrders.length}</span>{" "}
                  hasil
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {"<"}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === number
                            ? "bg-[#285A43] text-white border-[#285A43]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {number}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {">"}
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
