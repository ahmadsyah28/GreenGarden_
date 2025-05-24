"use client";

import React, { useState, useEffect } from "react";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import Link from "next/link";

const TanamanHias = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [selectedSort, setSelectedSort] = useState("Popular");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Sorting options
  const sortOptions = [
    "Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Name: A to Z",
    "Name: Z to A",
  ];

  // Fetch plants and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch plants
        const plantsResponse = await fetch("/api/plants");
        const plantsData = await plantsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories?type=Tanaman");
        const categoriesData = await categoriesResponse.json();

        if (plantsResponse.ok && categoriesResponse.ok) {
          setPlants(plantsData);
          setCategories(categoriesData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle category dropdown
  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Format price in Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Sort and filter plants
  const sortedAndFilteredPlants = () => {
    let filteredPlants = plants;

    // Filter by category
    if (selectedCategory !== "All") {
      filteredPlants = plants.filter(
        (plant) => plant.category === selectedCategory
      );
    }

    // Sort plants
    return [...filteredPlants].sort((a, b) => {
      switch (selectedSort) {
        case "Price: Low to High":
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        case "Name: A to Z":
          return a.name.localeCompare(b.name);
        case "Name: Z to A":
          return b.name.localeCompare(a.name);
        case "Popular":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt); // Default: sort by newest
      }
    });
  };

  // Get plants by category
  const getPlantsByCategory = (categoryName) => {
    return plants
      .filter((plant) => plant.category === categoryName)
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#50806B]"></div>
      </div>
    );
  }

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
            <div
              className="flex items-center gap-2 font-semibold cursor-pointer mb-2"
              onClick={() => setSelectedCategory("All")}
            >
              <FaAngleRight className="w-4 h-4" />
              All
            </div>
            {categories.map((category) => (
              <div key={category._id} className="mb-2">
                <div
                  className="flex items-center gap-2 font-semibold cursor-pointer"
                  onClick={() => {
                    toggleCategory(category.name);
                    setSelectedCategory(category.name);
                  }}
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
                    {getPlantsByCategory(category.name).length > 0 ? (
                      getPlantsByCategory(category.name).map((plant) => (
                        <p
                          key={plant._id}
                          className="text-sm hover:text-[#50806B] cursor-pointer py-1"
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {plant.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm py-1">
                        Tidak ada tanaman
                      </p>
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
            {sortedAndFilteredPlants().map((plant) => (
              <div
                key={plant._id}
                className="w-[250px] h-[330px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
              >
                <img
                  src={plant.image || "/placeholder-plant.png"}
                  alt={plant.name}
                  className="w-[250px] h-[175px] object-cover rounded-t-[10px]"
                />
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">
                  {plant.name}
                </p>
                <p className="text-[#404041] mt-2 ml-3">
                  {formatPrice(plant.price)}
                </p>
                <Link
                  href={`/layanan/tanaman-hias/${plant._id}`}
                  className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                >
                  Detail
                </Link>
              </div>
            ))}
            {sortedAndFilteredPlants().length === 0 && (
              <p className="text-gray-500 text-center w-full">
                Tidak ada tanaman yang ditemukan
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanamanHias;