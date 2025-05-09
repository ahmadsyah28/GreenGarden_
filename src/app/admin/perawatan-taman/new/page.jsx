// src/app/admin/perawatan-taman/new/page.jsx
"use client";

import { useState } from "react";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AddGardenCarePackagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [packageData, setPackageData] = useState({
    title: "",
    size: "",
    status: "Active",
    options: [
      { id: 1, name: "1 Kali Perawatan", price: 0 },
      { id: 2, name: "Paket 3 Bulan", price: 0 },
      { id: 3, name: "Paket 6 bulan", price: 0 },
    ],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!packageData.title) newErrors.title = "Judul paket wajib diisi";
    if (!packageData.size) newErrors.size = "Ukuran taman wajib diisi";
    packageData.options.forEach((option, index) => {
      if (!option.name) {
        newErrors[`optionName${index}`] = "Nama opsi wajib diisi";
      }
      if (option.price <= 0) {
        newErrors[`optionPrice${index}`] = "Harga harus lebih dari 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...packageData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === "price" ? parseInt(value) || 0 : value,
    };
    setPackageData((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/garden-cares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        alert("Paket perawatan berhasil ditambahkan!");
        router.push("/admin/perawatan-taman");
      } else {
        const data = await response.json();
        alert(`Gagal menambahkan paket: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-1 bg-white">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button
            onClick={() => router.push("/admin/perawatan-taman")}
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tambah Paket Perawatan</h1>
        </div>
        <p className="text-gray-600">
          Tambahkan paket perawatan baru ke inventaris Green Garden
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Judul Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={packageData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                placeholder="Garden Care untuk taman Ukuran 1-20m"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ukuran Taman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={packageData.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                placeholder="1-20m"
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">{errors.size}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={packageData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Opsi Perawatan
              </h2>
              {packageData.options.map((option, index) => (
                <div key={option.id} className="mb-4">
                  <label
                    htmlFor={`optionName${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nama Opsi {index + 1} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`optionName${index}`}
                    value={option.name}
                    onChange={(e) =>
                      handleOptionChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                    placeholder="1 Kali Perawatan"
                  />
                  {errors[`optionName${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`optionName${index}`]}
                    </p>
                  )}

                  <label
                    htmlFor={`optionPrice${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1 mt-2"
                  >
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id={`optionPrice${index}`}
                    value={option.price}
                    onChange={(e) =>
                      handleOptionChange(index, "price", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                    placeholder="399000"
                  />
                  {errors[`optionPrice${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`optionPrice${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/admin/perawatan-taman")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-[#50806B] text-white rounded-lg hover:bg-[#3d6854] transition-colors duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Simpan Paket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}