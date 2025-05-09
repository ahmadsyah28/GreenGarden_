"use client";
import React, { useState } from "react";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import Link from "next/link";
import { produkTanaman, categories, sortOptions } from "@/src/app/utils/data";

const TanamanHias = () => {
  const [openCategories, setOpenCategories] = useState({});
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  return (
    <div className="container bg-white">
      {/* Header */}
      <div id="header-tanaman-hias" className="h-24 bg-[#89A99A] flex">
        <p className="text-[#404041] my-auto text-3xl font-bold ml-[77px]">
          Tanaman Hias
        </p>
        <div className="h-3/5 my-auto w-[4px] bg-[#404041] ml-10"></div>
        <p className="text-[#404041] my-auto ml-5">
          Temukan Tanaman Hias yang sempurna untuk Taman Kesayangan Anda
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
              <p className="text-gray-500 text-sm">Plants on Sale</p>
            </div>

            {/* Category Loop */}
            {categories.map((category) => (
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
                      category.items.map((item) => <p key={item}>{item}</p>)
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
        <div className="w-[1120px] ml-0 h-full p-4">
          {/* Sort By Dropdown */}
          <div className="relative rounded-[20px] w-48 mr-[77px] mt-16 ml-auto">
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
            {produkTanaman.map((produk) => (
              <div
                key={produk.id}
                className="w-[250px] h-[330px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
              >
                <img
                  src={produk.src}
                  alt={`tanaman-${produk.id}`}
                  className="w-[250px] h-[175px] object-cover rounded-t-[10px]"
                />
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">{produk.nama}</p>
                <p className="text-[#404041] mt-2 ml-3">{produk.harga}</p>
                <Link
                  href={`/layanan/tanaman-hias/${produk.id}`}
                  className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                >
                  Detail
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanamanHias;