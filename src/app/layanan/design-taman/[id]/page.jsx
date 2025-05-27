"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { FaRuler, FaTree, FaLeaf, FaClipboardList } from "react-icons/fa";
import { desainTamanData } from "@/src/app/utils/data";

const DetailDesainTaman = ({ params }) => {
  const [desain, setDesain] = useState(null);
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
  
  // State untuk URL preview gambar
  const [previews, setPreviews] = useState({
    fotoPekarangan: null,
    fotoInspirasi: null,
  });

  useEffect(() => {
    // Cari desain berdasarkan ID
    if (params?.id) {
      const desainData = desainTamanData.find(
        (item) => item.id === parseInt(params.id)
      );
      setDesain(desainData);
    }
  }, [params]);

  // Handler perubahan luas tanah
  const handleLuasChange = (e) => {
    const value = e.target.value;
    setLuasTanah(value);

    if (desain) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setLuasError("Masukkan angka yang valid");
      } else if (numValue < desain.minArea) {
        setLuasError(
          `Luas minimum untuk desain ini adalah ${desain.minArea} m²`
        );
      } else if (numValue > desain.maxArea) {
        setLuasError(
          `Luas maksimum untuk desain ini adalah ${desain.maxArea} m²`
        );
      } else {
        setLuasError("");
      }
    }
  };

  // Handler untuk layanan tambahan
  const toggleService = (serviceName) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceName)) {
        return prev.filter((s) => s !== serviceName);
      } else {
        return [...prev, serviceName];
      }
    });
  };

  // Hitung total harga
  const calculateTotalPrice = () => {
    if (!desain) return 0;

    let total = desain.price;
    selectedServices.forEach((serviceName) => {
      const service = desain.additionalServices.find(
        (s) => s.name === serviceName
      );
      if (service) {
        total += service.price;
      }
    });

    return total;
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handler form konsultasi - PERBAIKAN: mengubah setFormData menjadi setFormDesain
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDesain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handler untuk input file
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Update state form dengan file yang dipilih
      setFormDesain({
        ...formDesain,
        [name]: files[0],
      });
      
      // Buat URL preview untuk gambar
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews({
        ...previews,
        [name]: previewUrl,
      });
    }
  };
  
  // Fungsi untuk menghapus gambar
  const handleRemoveImage = (name) => {
    setFormDesain({
      ...formDesain,
      [name]: null,
    });
    
    // Hapus URL preview dan bebaskan memori
    if (previews[name]) {
      URL.revokeObjectURL(previews[name]);
      setPreviews({
        ...previews,
        [name]: null,
      });
    }
  };


  if (!desain) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Desain tidak ditemukan</p>
        <Link
          href="/layanan/design-taman"
          className="text-[#50806B] font-semibold mt-4 inline-block"
        >
          Kembali ke halaman desain
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
  

      {/* Tombol Kembali */}
      <div className="mb-6 ml-[77px]">
        <Link
          href="/layanan/design-taman"
          className="flex items-center text-[#50806B] font-semibold"
        >
          <IoArrowBack className="mr-2" />
          Kembali ke Desain Taman
        </Link>
      </div>

      {/* Detail Content */}
      <div className="flex flex-wrap mx-[77px] gap-10">
        {/* Gambar Desain */}
        <div className="w-full md:w-2/5">
          <div className="border-2 border-slate-300 rounded-xl shadow-md overflow-hidden">
            <div className="relative w-full h-[400px]">
              <Image
                src={desain.image}
                alt={desain.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
            </div>
          </div>

          {/* Informasi tambahan */}
          <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-xl font-semibold text-[#404041] mb-4">
              Informasi Desain
            </h3>

            <div className="flex items-center mb-3 text-[#50806B]">
              <FaRuler className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Luas Tanah:</span>{" "}
                {desain.minArea} - {desain.maxArea} m²
              </span>
            </div>

            <div className="flex items-center mb-3 text-[#50806B]">
              <FaTree className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Cocok untuk:</span>{" "}
                {desain.suitableFor}
              </span>
            </div>

            <div className="flex items-start mb-3 text-[#50806B]">
              <FaLeaf className="mr-3 mt-1" />
              <div>
                <span className="font-medium text-[#404041]">
                  Tanaman Utama:
                </span>
                <ul className="mt-1 text-[#404041]">
                  {desain.mainPlants.map((plant, index) => (
                    <li key={index} className="ml-4 list-disc">
                      {plant}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center mb-3 text-[#50806B]">
              <FaClipboardList className="mr-3" />
              <span className="text-[#404041]">
                <span className="font-medium">Estimasi Waktu:</span>{" "}
                {desain.estimatedTimeToFinish}
              </span>
            </div>
          </div>
        </div>

        {/* Informasi Desain */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#404041] mb-3">
            {desain.name}
          </h1>
          <p className="text-2xl text-[#50806B] font-semibold mb-6">
            {formatPrice(desain.price)}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">
              Deskripsi
            </h2>
            <p className="text-gray-700">{desain.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">
              Fitur Desain
            </h2>
            <ul className="text-gray-700">
              {desain.features.map((feature, index) => (
                <li key={index} className="ml-4 list-disc mb-1">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          

          {/* Layanan Tambahan */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">
              Layanan Tambahan
            </h2>
            {desain.additionalServices.map((service, index) => (
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
            ))}
          </div>

          {/* Total Price */}
          <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">
              Total Harga
            </h2>
            <p className="text-2xl text-[#50806B] font-bold">
              {formatPrice(calculateTotalPrice())}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              *Harga aktual dapat bervariasi setelah konsultasi on-site
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4">
            <button
              className="bg-[#50806B] text-white py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto"
              onClick={() => setShowConsultationForm(true)}
              disabled={luasError !== ""}
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

     
      {/* Rekomendasi Desain Lain */}
      <div className="mt-16 mx-[77px]">
        <h2 className="text-2xl font-bold text-[#404041] mb-6">
          Desain Lainnya
        </h2>
        <div className="flex flex-wrap gap-6">
          {desainTamanData
            .filter((item) => item.id !== desain.id)
            .slice(0, 4)
            .map((produk) => (
              <div
                key={produk.id}
                className="w-[220px] h-[300px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
              >
                <div className="relative w-full h-[150px]">
                  <Image
                    src={produk.image}
                    alt={produk.name}
                    fill
                    className="object-cover rounded-t-[10px]"
                    sizes="220px"
                  />
                </div>
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">
                  {produk.name}
                </p>
                <p className="text-[#404041] mt-2 ml-3">
                  {formatPrice(produk.price)}
                </p>
                <Link
                  href={`/layanan/design-taman/${produk.id}`}
                  className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                >
                  Detail
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailDesainTaman;