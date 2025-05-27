"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import { sortOptions } from "@/src/app/utils/data";

const DesainTaman = () => {
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchArea, setSearchArea] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format harga
  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Ambil data desain dan kategori
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const desainResponse = await fetch("/api/desains");
        if (!desainResponse.ok) throw new Error("Gagal mengambil data desain");
        const desainData = await desainResponse.json();

        const categoryResponse = await fetch("/api/categories?type=DesainTaman");
        if (!categoryResponse.ok) throw new Error("Gagal mengambil data kategori");
        const categoryData = await categoryResponse.json();
        console.log("Kategori dari API:", categoryData);

        setFilteredProducts(desainData);
        setCategories(categoryData);
      } catch (err) {
        setError(err.message);
        setFilteredProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter dan urutkan desain
  const sortedAndFilteredDesains = () => {
    let result = [...filteredProducts];

    // Filter berdasarkan luas
    if (searchArea && !isNaN(parseFloat(searchArea))) {
      const area = parseFloat(searchArea);
      result = result.filter((product) => area >= product.minArea && area <= product.maxArea);
    }

    // Filter berdasarkan kategori
    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Urutkan desain
    if (selectedSort === "Termurah") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "Termahal") {
      result.sort((a, b) => b.price - a.price);
    }

    console.log("Desain setelah filter:", result);
    return result;
  };

  // Handler untuk input luas
  const handleAreaSearch = (e) => {
    setSearchArea(e.target.value);
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
        <Link href="/" className="text-[#50806B] font-semibold mt-4 inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

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
      <div className="flex h-auto">
        {/* Sidebar Filter */}
        <div className="w-[320px] h-full">
          <div className="w-56 p-4 mt-16 ml-[77px] bg-white shadow-md rounded-lg">
            <div className="mb-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                All Categories
              </div>
              <p className="text-gray-500 text-sm">Desain on Sale</p>
            </div>

            {/* Opsi All */}
            <div
              className="flex items-center gap-2 font-semibold cursor-pointer mb-2 text-sm hover:text-[#50806B] py-1"
              onClick={() => setSelectedCategory("All")}
            >
              <FaAngleRight className="w-4 h-4" />
              All
            </div>

            {/* Category Loop */}
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category._id} className="mb-2">
                  <div
                    className="flex items-center gap-2 font-semibold cursor-pointer text-sm hover:text-[#50806B] py-1"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <FaAngleRight className="w-4 h-4" />
                    {category.name}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm py-1">Tidak ada kategori tersedia</p>
            )}
          </div>
        </div>

        {/* Produk dan Sort */}
        <div className="w-[1120px] ml-0 h-full p-4">
          {/* Pencarian berdasarkan luas */}
          <div className="mb-4 border-b pb-4">
            <label htmlFor="area-search" className="block text-sm font-medium text-gray-700 mb-1">
              Cari berdasarkan luas (m²)
            </label>
            <input
              type="number"
              id="area-search"
              className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Masukkan luas taman"
              value={searchArea}
              onChange={handleAreaSearch}
            />
            <p className="text-xs text-gray-500 mt-1">
              Masukkan luas taman Anda untuk menemukan desain yang cocok
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative rounded-[20px] w-48 mr-[77px] mt-4 ml-auto">
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
          <div className="mt-4 flex flex-wrap justify-center gap-16">
            {sortedAndFilteredDesains().length > 0 ? (
              sortedAndFilteredDesains().map((product) => (
                <div
                  key={product._id}
                  className="w-[250px] h-[330px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
                >
                  <img
                    src={product.image || "/placeholder-design.png"}
                    alt={product.name}
                    className="w-[250px] h-[175px] object-cover rounded-t-[10px]"
                  />
                  <p className="text-[#404041] font-semibold text-base mt-2 ml-3">
                    {product.name}
                  </p>
                  <p className="text-[#404041] mt-2 ml-3">{formatPrice(product.price)}</p>
                  <Link
                    href={`/customer/layanan/design-taman/${product._id}`}
                    className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                  >
                    Detail
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center w-full">
                Tidak ada desain yang ditemukan
              </p>
            )}
          </div>

          {/* Konsultasi banner */}
          <div className="mt-12 mb-8 mx-4 md:mx-[77px] bg-[#89A99A] bg-opacity-20 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-bold text-[#404041] mb-2">Butuh Desain Khusus?</h2>
            <p className="text-gray-700 mb-4">
              Kami menyediakan layanan konsultasi dan desain taman sesuai dengan kebutuhan dan lahan Anda.
            </p>
            <Link
              href="https://wa.me/6287801482963?text=Halo,%20saya%20ingin%20konsultasi%20desain%20khusus"
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