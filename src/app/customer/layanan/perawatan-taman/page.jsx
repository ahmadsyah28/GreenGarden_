'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Service card component
const ServiceCard = ({ icon, title, altText }) => (
  <div className="flex flex-col items-center w-full sm:w-[250px] md:w-[350px]">
    <div className="relative w-16 h-16">
      <Image 
        src={icon} 
        alt={altText}
        fill
        className="object-contain"
      />
    </div>
    <p className="text-white text-lg md:text-xl font-semibold mt-5 text-center whitespace-pre-line">
      {title}
    </p>
  </div>
);

// Price package component
const PricePackage = ({ name, price, serviceId, optionId, packageInfo, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Format price with thousand separators
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price).replace('Rp', '');
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(serviceId, optionId, packageInfo);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-3 px-5 border-2 border-slate-500 shadow-xl rounded-[20px] w-full sm:w-auto transform transition duration-300 hover:scale-105 hover:border-primary bg-white">
      <p className="text-[#404041] text-xl md:text-2xl font-semibold">
        {name}
      </p>
      <p className="text-[#50806B] font-bold text-2xl md:text-3xl">
        {formattedPrice}
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="px-4 py-2 bg-[#50806B] text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-1"
        >
          {isLoading ? 'Loading...' : 'Keranjang'}
        </button>
      </div>
    </div>
  );
};

export default function PerawatanTanaman() {
  const [gardenPackages, setGardenPackages] = useState([]);
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate atau ambil valid ObjectId untuk userId
  const getUserId = () => {
    // Cek apakah sudah ada userId yang tersimpan
    let userId = localStorage.getItem('userId');
    
    if (!userId) {
      // Generate ObjectId baru jika belum ada
      // ObjectId format: 24 character hex string
      userId = generateObjectId();
      localStorage.setItem('userId', userId);
    }
    
    return userId;
  };

  // Function untuk generate ObjectId yang valid
  const generateObjectId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomBytes = Array.from({length: 16}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    return timestamp + randomBytes;
  };

  // Alternative: Jika Anda punya sistem auth, gunakan ini sebagai gantinya
  // const getUserId = () => {
  //   // Contoh dengan context auth
  //   // const { user } = useAuth();
  //   // return user?.id;
  //   
  //   // Contoh dengan session/cookies
  //   // return getSession()?.user?.id;
  //   
  //   // Contoh dengan JWT token
  //   // const token = localStorage.getItem('token');
  //   // const decoded = jwt.decode(token);
  //   // return decoded?.userId;
  // };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/garden-cares");
        const data = await response.json();

        if (response.ok) {
          setGardenPackages(data);
        } else {
          throw new Error(data.error || "Gagal mengambil data paket");
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Terjadi kesalahan saat mengambil data paket");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const addToCart = async (serviceId, optionId, packageInfo) => {
    try {
      const userId = getUserId();
      
      // Validasi userId sebelum mengirim request
      if (!userId || userId.length !== 24) {
        throw new Error('Invalid user ID. Please refresh the page and try again.');
      }
      
      console.log('Adding to cart with userId:', userId); // Debug log
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'garden-care',
          serviceId,
          optionId,
          quantity: 1,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Layanan perawatan berhasil ditambahkan ke keranjang!');
      } else {
        throw new Error(data.error || 'Gagal menambahkan ke keranjang');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  const goToNextPackage = () => {
    setCurrentPackageIndex((prev) => 
      prev === gardenPackages.length - 1 ? 0 : prev + 1
    );
  };
  
  const goToPrevPackage = () => {
    setCurrentPackageIndex((prev) => 
      prev === 0 ? gardenPackages.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (gardenPackages.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-600">Tidak ada paket perawatan tersedia saat ini.</p>
      </div>
    );
  }

  const currentPackage = gardenPackages[currentPackageIndex];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="h-20 md:h-24 bg-[#89A99A] flex items-center px-4">
        <h1 className="text-[#404041] text-2xl md:text-3xl font-bold ml-2 md:ml-[77px]">
          Perawatan Tanaman
        </h1>
        <div className="h-3/5 w-[4px] bg-[#404041] ml-4 md:ml-10"></div>
        <p className="text-[#404041] ml-4 md:ml-5 text-sm md:text-base">
          Temukan Perawatan Ideal untuk Taman Anda
        </p>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row py-8 md:py-10 px-4">
        <div className="w-full md:w-3/5 md:ml-[77px] pt-4 md:pt-16 pb-6 md:pb-10">
          <h2 className="text-[#404041] font-bold text-3xl md:text-5xl leading-tight">
            Tukang Taman untuk <br className="hidden md:block" />
            Pemeliharaan / Perawatan
          </h2>
          <div className="w-full md:w-2/3 mt-4">
            <p className="text-[#404041] font-medium text-base md:text-xl text-justify max-w-[663px]">
              Percayakan perawatan taman Anda pada layanan profesional kami.
              Dengan tim ahli yang berdedikasi, kami memastikan kelestarian dan
              keindahan taman melalui pemangkasan presisi, penyiraman terjadwal,
              pemupukan tepat, serta pengendalian hama dan penyakit. Kami juga
              menawarkan desain lanskap kreatif untuk menyegarkan tampilan
              taman. Nikmati keindahan dan kesejahteraan alam di sekitar Anda
              hubungi kami sekarang untuk transformasi taman yang memukau!
            </p>
          </div>
        </div>
        <div className="w-full md:w-2/5 flex justify-center md:justify-start">
          <div className="relative w-2/3">
            <Image
              src="/images/tukang.png"
              alt="Layanan Tukang Taman"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col items-center bg-[#1F2233] mt-6 md:mt-10 py-8 md:py-12 px-4 md:px-[77px]">
        <div className="text-center mb-8">
          <h3 className="text-[#ECE57E] text-xl md:text-2xl font-semibold">
            Apa saja yang didapat<br />
            dalam paket perawatan?
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-32 md:gap-8 w-full max-w-5xl">
          <ServiceCard 
            icon="/images/pupuk.png" 
            title={<>Pupuk Bunga<br />dan Daun</>} 
            altText="Pupuk Bunga"
          />
          <ServiceCard 
            icon="/images/sampah.png" 
            title={<>Pembersihan<br />Sampah Pasca <br/> Perawatan</>} 
            altText="Pembersihan Sampah"
          />
          <ServiceCard 
            icon="/images/gunting.png" 
            title={<>Pemangkasan<br />dan Perawatan</>} 
            altText="Pemangkasan"
          />
          <ServiceCard 
            icon="/images/spray.png" 
            title={<>Penyemprotan<br />Anti Hama</>} 
            altText="Penyemprotan"
          />
        </div>
      </div>

      {/* Packages Section */}
      <div className="mt-10 md:mt-16 text-center px-4 pb-16">
        <h3 className="text-[#404041] text-xl md:text-2xl font-semibold mb-10">
          Temukan Layanan Perawatan Taman<br className="hidden md:block" />
          yang Sesuai untuk Anda
        </h3>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-6">
            <button 
              onClick={goToPrevPackage}
              className="w-10 h-10 md:w-12 md:h-12 border-2 border-green-600 rounded-full flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition"
              aria-label="Previous package"
            >
              <FaArrowLeft className="text-lg md:text-xl" />
            </button>
            <button 
              onClick={goToNextPackage}
              className="w-10 h-10 md:w-12 md:h-12 border-2 border-green-800 rounded-full flex items-center justify-center text-green-800 hover:bg-green-800 hover:text-white transition"
              aria-label="Next package"
            >
              <FaArrowRight className="text-lg md:text-xl" />
            </button>
          </div>
          <p className="text-primary text-lg font-semibold">
            {currentPackage.title}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-8 md:mt-10 justify-items-center">
          {currentPackage.options.map((option) => (
            <PricePackage 
              key={option.id} 
              name={option.name} 
              price={option.price}
              serviceId={currentPackage.id}
              optionId={option.id}
              packageInfo={{
                title: currentPackage.title,
                size: currentPackage.size
              }}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      {/* Debug info - hapus setelah selesai testing */}
      {/* <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs">
        User ID: {getUserId()}
      </div> */}
    </div>
  );
}