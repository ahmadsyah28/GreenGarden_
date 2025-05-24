"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { desainTamanData, desainCategories, sortOptions } from "@/src/app/utils/data";


// Komponen ProductCard
const ProductCard = ({ product }) => {
  // Format harga
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);
  
  return (
    <div className="w-[250px] h-[360px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-xl overflow-hidden">
      <div className="relative w-[250px] h-[175px]">
        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-cover rounded-t-xl"
          sizes="250px"
          priority={product.id <= 4}
        />
      </div>
      <div className="p-3">
        <p className="text-[#404041] font-semibold text-base truncate">{product.name}</p>
        <p className="text-[#404041] mt-2">{formattedPrice}</p>
        <p className="text-gray-500 text-sm mt-1">Luas: {product.minArea}-{product.maxArea} m²</p>
        <Link 
          href={`/layanan/design-taman/${product.id}`} 
          className="block w-full bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
        >
          Detail
        </Link>
      </div>
    </div>
  );
};

const DesainTaman = () => {
  const [openCategories, setOpenCategories] = useState({});
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([...desainTamanData]);
  const [searchArea, setSearchArea] = useState('');

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Fungsi untuk memfilter dan mengurutkan produk
  useEffect(() => {
    let result = [...desainTamanData];
    
    // Filter berdasarkan luas yang diinput
    if (searchArea && !isNaN(parseFloat(searchArea))) {
      const area = parseFloat(searchArea);
      result = result.filter(product => 
        area >= product.minArea && area <= product.maxArea
      );
    }
    
    // Urutkan produk
    if (selectedSort === "Termurah") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "Termahal") {
      result.sort((a, b) => b.price - a.price);
    }
    
    setFilteredProducts(result);
  }, [selectedSort, searchArea]);

  // Handler untuk input luas
  const handleAreaSearch = (e) => {
    setSearchArea(e.target.value);
  };

  return (
    <div className="container mx-auto bg-white">
      {/* Header */}
      <div id="header-desain-taman" className="h-24 bg-[#89A99A] flex items-center">
        <p className="text-[#404041] text-3xl font-bold ml-5 md:ml-[77px]">
          Desain Taman
        </p>
        <div className="h-3/5 w-[4px] bg-[#404041] ml-5 md:ml-10"></div>
        <p className="text-[#404041] ml-5 max-w-md">
          Desain Taman Siap Pakai untuk Mewujudkan Taman Impian Anda
        </p>
      </div>

      {/* Market Place */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filter */}
        <div className="w-full md:w-[320px] h-full">
          <div className="w-full md:w-56 p-4 mt-16 mx-auto md:ml-[77px] bg-white shadow-md rounded-lg">
            <div className="mb-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                All Categories
              </div>
              <p className="text-gray-500 text-sm">Desain on Sale</p>
            </div>

            {/* Pencarian berdasarkan luas */}
            <div className="mb-4 border-b pb-4">
              <label htmlFor="area-search" className="block text-sm font-medium text-gray-700 mb-1">
                Cari berdasarkan luas (m²)
              </label>
              <input
                type="number"
                id="area-search"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Masukkan luas taman"
                value={searchArea}
                onChange={handleAreaSearch}
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan luas taman Anda untuk menemukan desain yang cocok
              </p>
            </div>

            {/* Category Loop */}
            {desainCategories.map((category) => (
              <div key={category.name} className="mb-2">
                <div
                  className="flex items-center gap-2 font-semibold cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  {openCategories[category.name] ? (
                    <FaAngleDown className="w-4 h-4" />
                  ) : (
                    <FaAngleRight className="w-4 h-4" />
                  )}
                  {category.name}
                </div>

                {openCategories[category.name] && (
                  <div className="ml-6 text-gray-600">
                    {category.items.length > 0 ? (
                      category.items.map((item) => (
                        <div key={item} className="flex items-center mt-1">
                          <input 
                            type="checkbox" 
                            id={item} 
                            className="mr-2" 
                          />
                          <label htmlFor={item}>{item}</label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No items</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Produk dan Sort */}
        <div className="w-full md:w-[calc(100%-320px)] p-4">
          {/* Sort By Dropdown */}
          <div className="relative rounded-[20px] w-48 mr-0 md:mr-[77px] mt-16 ml-auto">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md flex justify-between items-center"
            >
              {selectedSort}
              <FaAngleDown className="w-4 h-4 text-gray-500" />
            </button>

            {isSortOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
                {sortOptions.map((option) => (
                  <p
                    key={option}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSelectedSort(option);
                      setIsSortOpen(false);
                    }}
                  >
                    {option}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="mt-4 flex flex-wrap justify-center gap-8 md:gap-16">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="w-full text-center py-10">
                <p className="text-xl text-gray-600">
                  Tidak ada desain yang cocok dengan luas yang Anda masukkan.
                </p>
                <p className="text-gray-500 mt-2">
                  Coba masukkan luas yang berbeda atau hubungi kami untuk konsultasi desain khusus.
                </p>
                <Link 
                  href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20konsultasi%20desain%20taman%20khusus"
                  target="_blank"
                  className="inline-block mt-4 bg-[#50806B] text-white py-2 px-6 rounded-xl font-semibold"
                >
                  Konsultasi Desain Khusus
                </Link>
              </div>
            )}
          </div>

          {/* Konsultasi banner */}
          <div className="mt-12 mb-8 mx-4 md:mx-[77px] bg-[#89A99A] bg-opacity-20 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-[#404041] mb-2">Butuh Desain Khusus?</h2>
            <p className="text-gray-700 mb-4">
              Kami menyediakan layanan konsultasi dan desain taman sesuai dengan kebutuhan dan lahan Anda.
            </p>
            <Link 
              href="https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20konsultasi%20desain%20taman%20khusus"
              target="_blank"
              className="inline-block bg-[#50806B] text-white py-2 px-6 rounded-xl font-semibold"
            >
              Konsultasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesainTaman;