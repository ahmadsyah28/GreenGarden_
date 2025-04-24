"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { FaRuler, FaTree, FaLeaf, FaClipboardList } from "react-icons/fa";
import { desainTamanData } from "@/src/app/utils/data";



const DetailDesainTaman = ({ params }) => {
  const [desain, setDesain] = useState(null);
  const [luasTanah, setLuasTanah] = useState('');
  const [luasError, setLuasError] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    catatanTambahan: ''
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
        setLuasError('Masukkan angka yang valid');
      } else if (numValue < desain.minArea) {
        setLuasError(`Luas minimum untuk desain ini adalah ${desain.minArea} m²`);
      } else if (numValue > desain.maxArea) {
        setLuasError(`Luas maksimum untuk desain ini adalah ${desain.maxArea} m²`);
      } else {
        setLuasError('');
      }
    }
  };

  // Handler untuk layanan tambahan
  const toggleService = (serviceName) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceName)) {
        return prev.filter(s => s !== serviceName);
      } else {
        return [...prev, serviceName];
      }
    });
  };

  // Hitung total harga
  const calculateTotalPrice = () => {
    if (!desain) return 0;
    
    let total = desain.price;
    selectedServices.forEach(serviceName => {
      const service = desain.additionalServices.find(s => s.name === serviceName);
      if (service) {
        total += service.price;
      }
    });
    
    return total;
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handler form konsultasi
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitConsultation = (e) => {
    e.preventDefault();
    // Di sini nanti akan mengirim data ke backend
    alert('Permintaan konsultasi telah dikirim! Tim kami akan menghubungi Anda segera.');
    setShowConsultationForm(false);
  };

  if (!desain) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Desain tidak ditemukan</p>
        <Link href="/layanan/desain-taman" className="text-[#50806B] font-semibold mt-4 inline-block">
          Kembali ke halaman desain
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div id="header-desain-taman" className="h-24 bg-[#89A99A] flex mb-8">
        <p className="text-[#404041] my-auto text-3xl font-bold ml-[77px]">
          Detail Desain Taman
        </p>
        <div className="h-3/5 my-auto w-[4px] bg-[#404041] ml-10"></div>
        <p className="text-[#404041] my-auto ml-5">
          Informasi lengkap tentang desain taman pilihan Anda
        </p>
      </div>

      {/* Tombol Kembali */}
      <div className="mb-6 ml-[77px]">
        <Link href="/layanan/desain-taman" className="flex items-center text-[#50806B] font-semibold">
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
                  {desain.mainPlants.map((plant, index) => (
                    <li key={index} className="ml-4 list-disc">{plant}</li>
                  ))}
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
        </div>

        {/* Informasi Desain */}
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
              {desain.features.map((feature, index) => (
                <li key={index} className="ml-4 list-disc mb-1">{feature}</li>
              ))}
            </ul>
          </div>
          
          {/* Input Luas Tanah */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Masukkan Luas Tanah Anda</h2>
            <div className="flex items-center">
              <input
                type="number"
                value={luasTanah}
                onChange={handleLuasChange}
                className="border-2 border-gray-300 rounded-lg p-2 mr-2 w-24"
                placeholder="0"
              />
              <span className="text-gray-700">m²</span>
            </div>
            {luasError && <p className="text-red-500 mt-1 text-sm">{luasError}</p>}
            {!luasError && luasTanah && 
              <p className="text-green-600 mt-1 text-sm">
                Luas tanah Anda sesuai untuk desain ini!
              </p>
            }
          </div>
          
          {/* Layanan Tambahan */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Layanan Tambahan</h2>
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
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Total Harga</h2>
            <p className="text-2xl text-[#50806B] font-bold">{formatPrice(calculateTotalPrice())}</p>
            <p className="text-sm text-gray-500 mt-1">
              *Harga aktual dapat bervariasi setelah konsultasi on-site
            </p>
          </div>
          
          {/* Tombol Aksi */}
          <div className="flex gap-4">
            <button 
              className="bg-[#50806B] text-white py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto"
              onClick={() => setShowConsultationForm(true)}
              disabled={luasError !== ''}
            >
              Konsultasi Desain
            </button>
            <Link 
              href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20desain%20${encodeURIComponent(desain.name)}%20dengan%20luas%20tanah%20${luasTanah}%20m²`} 
              target="_blank" 
              className="bg-white text-[#50806B] border-2 border-[#50806B] py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto flex items-center justify-center"
            >
              Konsultasi via WhatsApp
            </Link>
          </div>
        </div>
      </div>
      
      {/* Form Konsultasi (Modal) */}
      {showConsultationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#404041] mb-4">Form Konsultasi Desain</h2>
            
            <form onSubmit={handleSubmitConsultation}>
              <div className="mb-4">
                <label htmlFor="nama" className="block text-gray-700 font-medium mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="telepon" className="block text-gray-700 font-medium mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleFormChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="alamat" className="block text-gray-700 font-medium mb-1">Alamat Lokasi Taman</label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleFormChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-2 h-24"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="catatanTambahan" className="block text-gray-700 font-medium mb-1">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  id="catatanTambahan"
                  name="catatanTambahan"
                  value={formData.catatanTambahan}
                  onChange={handleFormChange}
                  className="w-full border-2 border-gray-300 rounded-lg p-2 h-24"
                  placeholder="Deskripsi kondisi lahan, kebutuhan, atau pertanyaan lainnya..."
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowConsultationForm(false)}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-xl text-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#50806B] text-white py-2 px-6 rounded-xl text-lg font-semibold"
                >
                  Kirim Permintaan Konsultasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rekomendasi Desain Lain */}
      <div className="mt-16 mx-[77px]">
        <h2 className="text-2xl font-bold text-[#404041] mb-6">Desain Lainnya</h2>
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
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">{produk.name}</p>
                <p className="text-[#404041] mt-2 ml-3">{formatPrice(produk.price)}</p>
                <Link
                  href={`/layanan/desain-taman/${produk.id}`}
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