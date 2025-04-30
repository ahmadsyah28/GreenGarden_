"use client";

import { useState, useEffect } from "react";
import { FaLeaf, FaArrowLeft, FaSave, FaImage, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AddPlantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    care: "",
    requirements: "",
    status: "In Stock"
  });
  
  // Mengambil data kategori saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Mengambil kategori khusus tanaman
        const response = await fetch('/api/categories?type=Tanaman');
        const data = await response.json();
        
        if (response.ok) {
          // Ekstrak nama kategori dari data
          const categoryNames = data.map(cat => cat.name);
          setCategories(categoryNames);
          
          // Set kategori default jika ada kategori
          if (categoryNames.length > 0) {
            setFormData(prev => ({ ...prev, category: categoryNames[0] }));
          }
        } else {
          console.error('Gagal mengambil kategori:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Jika kategori "Tambah Kategori Baru" dipilih, buka modal
    if (name === "category" && value === "new_category") {
      setShowCategoryModal(true);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  // Menambahkan kategori baru
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;
    
    // Cek apakah kategori sudah ada
    if (categories.includes(newCategory)) {
      alert("Kategori ini sudah ada!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Kirim kategori baru ke API dengan tipe Tanaman
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newCategory,
          type: 'Tanaman'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Tambahkan kategori baru ke daftar
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        
        // Update form dengan kategori baru
        setFormData(prev => ({
          ...prev,
          category: newCategory
        }));
        
        // Reset dan tutup modal
        setNewCategory("");
        setShowCategoryModal(false);
      } else {
        alert(`Gagal menambahkan kategori: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan kategori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Siapkan data untuk dikirim ke API
      const plantData = {
        ...formData,
        price: parseFloat(formData.price.replace(/\./g, "")),
        stock: parseInt(formData.stock),
        image: imagePreview || "",
      };
      
      // Kirim data ke API
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plantData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Tampilkan pesan sukses
        alert("Tanaman berhasil ditambahkan!");
        
        // Navigasi kembali ke halaman daftar tanaman
        router.push("/admin/tanaman-hias");
      } else {
        alert(`Gagal menambahkan tanaman: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menambahkan tanaman.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format price to IDR
  const formatPrice = (value) => {
    if (!value) return "";
    
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    
    // Format with thousand separators
    return new Intl.NumberFormat("id-ID").format(numericValue);
  };

  return (
    <div className="p-1">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => router.push("/admin/tanaman-hias")}
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tambah Tanaman Baru</h1>
        </div>
        <p className="text-gray-600">Tambahkan tanaman baru ke inventaris Green Garden</p>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Tanaman</h2>
              
              {/* Product Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Tanaman <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  placeholder="Monstera Deliciosa"
                />
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="new_category">+ Tambah Kategori Baru</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3 py-2 bg-[#50806B] text-white rounded-lg hover:bg-[#3d6854] transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const formatted = formatPrice(e.target.value);
                      setFormData(prev => ({ ...prev, price: formatted }));
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                    placeholder="20.000"
                  />
                </div>
              </div>
              
              {/* Stock */}
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  placeholder="10"
                />
              </div>
              
              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail & Gambar</h2>
              
              {/* Product Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Tanaman
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-48 w-auto object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#50806B] hover:text-[#3d6854] focus-within:outline-none"
                          >
                            <div className="flex flex-col items-center">
                              <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                              <span>Unggah gambar</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageUpload}
                              />
                            </div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  placeholder="Deskripsi tanaman..."
                ></textarea>
              </div>
              
              {/* Care Instructions */}
              <div className="mb-4">
                <label htmlFor="care" className="block text-sm font-medium text-gray-700 mb-1">
                  Perawatan
                </label>
                <textarea
                  id="care"
                  name="care"
                  rows="2"
                  value={formData.care}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  placeholder="Instruksi perawatan tanaman..."
                ></textarea>
              </div>
              
              {/* Requirements */}
              <div className="mb-4">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Kebutuhan
                </label>
                <input
                  type="text"
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                  placeholder="Cahaya, air, dll."
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push("/admin/tanaman-hias")}
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Simpan Tanaman
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Tambah Kategori */}
      {showCategoryModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
           
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaLeaf className="text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tambah Kategori Baru</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-3">
                        Masukkan nama kategori baru yang ingin Anda tambahkan.
                      </p>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nama kategori baru"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#50806B] text-base font-medium text-white hover:bg-[#3d6854] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCategory}
                >
                  Tambah
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}