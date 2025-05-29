// components/DetailDesainTaman.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { FaRuler, FaTree, FaLeaf, FaClipboardList } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const DetailDesainTaman = ({ params: paramsPromise }) => {
  const params = React.use(paramsPromise);
  const { id } = params || {};
  const [desain, setDesain] = useState(null);
  const [recommendedDesains, setRecommendedDesains] = useState([]);
  const [luasTanah, setLuasTanah] = useState("");
  const [luasError, setLuasError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [formDesain, setFormDesain] = useState({
    kategori: "",
    nama: "",
    telepon: "",
    alamat: "",
    fotoPekarangan: null,
    fotoInspirasi: null,
  });
  const [previews, setPreviews] = useState({
    fotoPekarangan: null,
    fotoInspirasi: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = React.useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("ID desain tidak valid");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const desainResponse = await fetch(`/api/desains/${id}`);
        if (!desainResponse.ok) {
          const errorData = await desainResponse.json();
          throw new Error(errorData.message || "Gagal mengambil detail desain");
        }
        const desainData = await desainResponse.json();
        setDesain(desainData);

        const desainsResponse = await fetch("/api/desains");
        if (!desainsResponse.ok) {
          throw new Error("Gagal mengambil rekomendasi desain");
        }
        const desainsData = await desainsResponse.json();
        setRecommendedDesains(
          desainsData.filter((desain) => desain._id !== id).slice(0, 4)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLuasChange = (e) => {
    const value = e.target.value;
    setLuasTanah(value);

    if (desain) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setLuasError("Masukkan angka yang valid");
      } else if (numValue < desain.minArea) {
        setLuasError(`Luas minimum untuk desain ini adalah ${desain.minArea} m²`);
      } else if (numValue > desain.maxArea) {
        setLuasError(`Luas maksimum untuk desain ini adalah ${desain.maxArea} m²`);
      } else {
        setLuasError("");
      }
    }
  };

  const toggleService = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const calculateTotalPrice = () => {
    if (!desain) return 0;

    let total = desain.price;
    selectedServices.forEach((serviceName) => {
      const service = desain.additionalServices.find((s) => s.name === serviceName);
      if (service) total += service.price;
    });

    return total;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const addToCart = async () => {
    if (!isAuthenticated || !user) {
      alert("Silakan login untuk menambahkan item ke keranjang.");
      router.push("/login");
      return;
    }

    if (luasError) {
      alert("Masukkan luas tanah yang valid.");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "design",
          itemId: id,
          quantity: 1,
          userId: user._id,
          additionalServices: desain.additionalServices
            .filter((service) => selectedServices.includes(service.name))
            .map((service) => ({
              name: service.name,
              price: service.price,
            })),
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "Gagal menambahkan ke keranjang");
      }

      alert("Desain berhasil ditambahkan ke keranjang!");
      router.push("/customer/keranjang");
    } catch (err) {
      console.error("Error menambahkan ke keranjang:", err);
      alert(`Gagal menambahkan ke keranjang: ${err.message}`);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDesain((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormDesain((prev) => ({ ...prev, [name]: files[0] }));
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
    }
  };

  const handleRemoveImage = (name) => {
    setFormDesain((prev) => ({ ...prev, [name]: null }));
    if (previews[name]) {
      URL.revokeObjectURL(previews[name]);
      setPreviews((prev) => ({ ...prev, [name]: null }));
    }
  };

  if (!id || id === "undefined") {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>ID desain tidak valid</p>
        <Link
          href="/customer/layanan/design-taman"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke halaman desain
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B] mx-auto"></div>
      </div>
    );
  }

  if (error || !desain) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>{error || "Desain tidak ditemukan"}</p>
        <Link
          href="/customer/layanan/design-taman"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke halaman desain
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="mb-6 ml-[77px]">
        <Link
          href="/customer/layanan/design-taman"
          className="flex items-center text-[#50806B] font-semibold"
        >
          <IoArrowBack className="mr-2" />
          Kembali ke Desain Taman
        </Link>
      </div>

      <div className="flex flex-wrap mx-[77px] gap-10">
        <div className="w-full md:w-2/5">
          <div className="border-2 border-slate-300 rounded-xl shadow-md overflow-hidden">
            <div className="relative w-full h-[400px]">
              <Image
                src={desain.image || "/placeholder-design.png"}
                alt={desain.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>

          <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-[#404041] mb-4">Informasi Desain</h3>
            <div className="flex items-center mb-3 text-[#50806B]">
              <FaRuler className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Luas Tanah:</span> {desain.minArea} - {desain.maxArea} m²
              </span>
            </div>
            <div className="flex items-center mb-3 text-[#50806B]">
              <FaTree className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Cocok untuk:</span> {desain.suitableFor}
              </span>
            </div>
            <div className="flex items-start mb-3 text-[#50806B]">
              <FaLeaf className="mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#404041]">Tanaman Utama:</span>
                <ul className="mt-1 text-[#404041]">
                  {desain.mainPlants?.map((plant, index) => (
                    <li key={index} className="ml-4 list-disc">{plant}</li>
                  )) || <li className="ml-4 list-disc">Tidak ada tanaman utama</li>}
                </ul>
              </div>
            </div>
            <div className="flex items-center mb-3 text-[#50806B]">
              <FaClipboardList className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Estimasi Waktu:</span> {desain.estimatedTimeToFinish}
              </span>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-[#404041] mb-4">Luas Tanah</h3>
            <input
              type="number"
              value={luasTanah}
              onChange={handleLuasChange}
              placeholder="Masukkan luas tanah (m²)"
              className="w-full p-2 border rounded-lg"
            />
            {luasError && <p className="text-red-600 mt-2">{luasError}</p>}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#404041] mb-3">{desain.name}</h1>
          <p className="text-2xl text-[#50806B] font-semibold mb-6">{formatPrice(desain.price)}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Deskripsi</h2>
            <p className="text-gray-700">{desain.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Fitur Desain</h2>
            <ul className="text-gray-700">
              {desain.features?.map((feature, index) => (
                <li key={index} className="ml-4 list-disc mb-1">{feature}</li>
              )) || <li className="ml-4 list-disc">Tidak ada fitur tersedia</li>}
            </ul>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Layanan Tambahan</h2>
            {desain.additionalServices?.length > 0 ? (
              desain.additionalServices.map((service, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`service-${index}`}
                    checked={selectedServices.includes(service.name)}
                    onChange={() => toggleService(service.name)}
                    className="w-4 h-4 mr-2"
                  />
                  <label htmlFor={`service-${index}`} className="text-gray-700">
                    {service.name} ({formatPrice(service.price)})
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-700">Tidak ada layanan tambahan tersedia</p>
            )}
          </div>
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Total Harga</h2>
            <p className="text-2xl text-[#50806B] font-bold">{formatPrice(calculateTotalPrice())}</p>
            <p className="text-sm text-gray-500 mt-1">
              *Harga aktual dapat bervariasi setelah konsultasi on-site
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-[#50806B] text-white py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto"
              onClick={addToCart}
            >
              Tambah ke Keranjang
            </button>
            <Link
              href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20desain%20${encodeURIComponent(
                desain.name
              )}%20dengan%20luas%20tanah%20${luasTanah}%20m²`}
              target="_blank"
              className="bg-white text-[#50806B] border-2 border-[#50806B] py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto flex items-center justify-center"
            >
              Konsultasi via WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 mx-[77px]">
        <h2 className="text-2xl font-bold text-[#404041] mb-6">Desain Lainnya</h2>
        <div className="flex flex-wrap gap-6">
          {recommendedDesains.length > 0 ? (
            recommendedDesains.map((produk) => (
              <div
                key={produk._id}
                className="w-[220px] h-[300px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
              >
                <div className="relative w-full h-[150px]">
                  <Image
                    src={produk.image || "/placeholder-design.png"}
                    alt={produk.name}
                    fill
                    className="object-cover rounded-t-[10px]"
                    sizes="220px"
                  />
                </div>
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">{produk.name}</p>
                <p className="text-[#404041] mt-2 ml-3">{formatPrice(produk.price)}</p>
                <Link
                  href={`/customer/layanan/design-taman/${produk._id}`}
                  className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                >
                  Detail
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada rekomendasi desain tersedia</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDesainTaman;