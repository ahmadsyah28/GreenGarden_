"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DetailTanaman({ params }) {
  const [tanaman, setTanaman] = useState(null);
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const router = useRouter();

  // Membuka params menggunakan React.use
  const { id } = React.use(params);

  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, user });
    console.log("localStorage user:", localStorage.getItem("user"));
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const plantResponse = await fetch(`/api/plants/${id}`);
        if (!plantResponse.ok) {
          throw new Error("Gagal mengambil detail tanaman");
        }
        const plantData = await plantResponse.json();
        setTanaman(plantData);

        const plantsResponse = await fetch("/api/plants");
        if (!plantsResponse.ok) {
          throw new Error("Gagal mengambil rekomendasi tanaman");
        }
        const plantsData = await plantsResponse.json();
        setRecommendedPlants(
          plantsData.filter((plant) => plant._id !== id).slice(0, 4)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const tambahJumlah = () => {
    if (tanaman && jumlah < tanaman.stock) {
      setJumlah(jumlah + 1);
    }
  };

  const kurangJumlah = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  // components/DetailTanaman.js
const addToCart = async () => {
  if (!isAuthenticated || !user) {
    alert("Silakan login untuk menambahkan item ke keranjang.");
    router.push("/login");
    return;
  }

  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "plant",
        itemId: id,
        quantity: jumlah,
        userId: user._id,
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error || "Gagal menambahkan ke keranjang");
    }

    alert("Item berhasil ditambahkan ke keranjang!");
    router.push("/customer/keranjang");
  } catch (err) {
    console.error("Error menambahkan ke keranjang:", err);
    alert(`Gagal menambahkan ke keranjang: ${err.message}`);
  }
};

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
      </div>
    );
  }

  if (error || !tanaman) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>{error || "Tanaman tidak ditemukan"}</p>
        <Link
          href="/customer/layanan/tanaman-hias"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke halaman tanaman
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="mb-6 ml-[77px]">
        <Link
          href="/customer/layanan/tanaman-hias"
          className="flex items-center text-[#50806B] font-semibold"
        >
          <IoArrowBack className="mr-2" />
          Kembali ke Tanaman Hias
        </Link>
      </div>

      <div className="flex flex-wrap mx-[77px] gap-10">
        <div className="w-full md:w-2/5">
          <div className="border-2 border-slate-300 rounded-xl shadow-md overflow-hidden">
            <img
              src={tanaman.image || "/placeholder-plant.png"}
              alt={tanaman.name}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#404041] mb-3">{tanaman.name}</h1>
          <p className="text-2xl text-[#50806B] font-semibold mb-6">{formatPrice(tanaman.price)}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Deskripsi</h2>
            <p className="text-gray-700">{tanaman.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Perawatan</h2>
            <p className="text-gray-700">{tanaman.care || "Tidak ada informasi perawatan"}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Kebutuhan</h2>
            <p className="text-gray-700">{tanaman.requirements || "Tidak ada informasi kebutuhan"}</p>
          </div>

          <div className="flex items-center mb-8">
            <span className="text-lg font-semibold text-[#404041] mr-4">Jumlah:</span>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={kurangJumlah}
                className="px-3 py-1 text-xl font-semibold"
                disabled={jumlah <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 text-lg">{jumlah}</span>
              <button
                onClick={tambahJumlah}
                className="px-3 py-1 text-xl font-semibold"
                disabled={tanaman.stock === 0 || jumlah >= tanaman.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className={`bg-[#50806B] text-white py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto ${
                tanaman.stock === 0 ? "bg-gray-400 pointer-events-none" : ""
              }`}
            >
              Tambah ke Keranjang
            </button>
            <Link
              href="/customer/checkout"
              className={`bg-white text-[#50806B] border-2 border-[#50806B] py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto ${
                tanaman.stock === 0 ? "border-gray-400 text-gray-400 pointer-events-none" : ""
              }`}
            >
              Beli Sekarang
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 mx-[77px]">
        <h2 className="text-2xl font-bold text-[#404041] mb-6">Tanaman Lainnya</h2>
        <div className="flex flex-wrap gap-6">
          {recommendedPlants.map((produk) => (
            <div
              key={produk._id}
              className="w-[220px] h-[300px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
            >
              <img
                src={produk.image || "/placeholder-plant.png"}
                alt={produk.name}
                className="w-full h-[150px] object-cover rounded-t-[10px]"
              />
              <p className="text-[#404041] font-semibold text-base mt-2 ml-3">{produk.name}</p>
              <p className="text-[#404041] mt-2 ml-3">{formatPrice(produk.price)}</p>
              <Link
                href={`/customer/layanan/tanaman-hias/${produk._id}`}
                className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
              >
                Detail
              </Link>
            </div>
          ))}
          {recommendedPlants.length === 0 && (
            <p className="text-gray-700">Tidak ada rekomendasi tanaman lainnya.</p>
          )}
        </div>
      </div>
    </div>
  );
}