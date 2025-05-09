'use client'; // Add this for Next.js 13+ client components

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Sample package data - in a real app, this might come from an API
const gardenPackages = [
  {
    id: 1,
    title: "Garden Care untuk taman Ukuran 1-20m",
    options: [
      { id: 1, name: "1 Kali Perawatan", price: 399000 },
      { id: 2, name: "Paket 3 Bulan", price: 999000 },
      { id: 3, name: "Paket 6 bulan", price: 1399000 },
    ],
  },
  {
    id: 2,
    title: "Garden Care untuk taman Ukuran 21-50m",
    options: [
      { id: 4, name: "1 Kali Perawatan", price: 599000 },
      { id: 5, name: "Paket 3 Bulan", price: 1299000 },
      { id: 6, name: "Paket 6 bulan", price: 1899000 },
    ],
  },
  {
    id: 3,
    title: "Garden Care untuk taman Ukuran 51-100m",
    options: [
      { id: 7, name: "1 Kali Perawatan", price: 799000 },
      { id: 8, name: "Paket 3 Bulan", price: 1999000 },
      { id: 9, name: "Paket 6 bulan", price: 2899000 },
    ],
  },
];

// Service card component
const ServiceCard = ({ icon, title, altText }) => (
  <div className="flex flex-col items-center w-full sm:w-[250px] md:w-[350px] ">
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
const PricePackage = ({ name, price }) => {
  // Format price with thousand separators
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price).replace('Rp', '');
  
  return (
    <div className="py-3 px-5 border-2 border-slate-500 shadow-xl rounded-[20px] w-full sm:w-auto transform transition duration-300 hover:scale-105 hover:border-primary bg-white">
      <p className="text-[#404041] text-xl md:text-2xl font-semibold">
        {name}
      </p>
      <p className="text-[#50806B] font-bold text-2xl md:text-3xl">
        {formattedPrice}
      </p>
      <Link 
        href="/booking"
        className="mt-4 inline-block px-6 py-2 bg-[#50806B] text-white rounded-lg font-medium hover:bg-opacity-90 transition"
      >
        Pesan
      </Link>
    </div>
  );
};

export default function PerawatanTanaman() {
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const currentPackage = gardenPackages[currentPackageIndex];
  
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
        {/* Title and description */}
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

        {/* Hero image */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-start">
          <div className="relative w-2/3">
            <Image
              src="/images/tukang.png"
              alt="Layanan Tukang Taman"
              fill
              className="object-contain "
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
          {/* Navigation buttons */}
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

          {/* Package title */}
          <p className="text-primary text-lg font-semibold">
            {currentPackage.title}
          </p>
        </div>
        
        {/* Package price cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-8   md:mt-10 justify-items-center">
          {currentPackage.options.map((option) => (
            <PricePackage 
              key={option.id} 
              name={option.name} 
              price={option.price}
              
            />
          ))}
        </div>
      </div>
    </div>
  );
}