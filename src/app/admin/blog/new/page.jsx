"use client";

import { useState, useRef } from "react";
import { 
  FaBlog, 
  FaImage, 
  FaSave, 
  FaTimes, 
  FaEye, 
  FaArrowLeft, 
  FaPlus, 
  FaTags,
  FaUpload,
  FaTrash
} from "react-icons/fa";

export default function NewBlogArticlePage() {
  // Article state
  const [article, setArticle] = useState({
    title: "",
    category: "Tanaman Hias",
    content: "",
    tags: [],
    featured: false,
    status: "Draft",
    featuredImage: null,
    gallery: []
  });
  
  // Editor states
  const [tagInput, setTagInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Available categories
  const categories = [
    "Tanaman Hias", 
    "Tips & Tricks", 
    "Organik", 
    "Urban Gardening", 
    "Tanaman Fungsional", 
    "Herbal"
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle({
      ...article,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add tag when Enter key is pressed
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!article.tags.includes(tagInput.trim())) {
        setArticle({
          ...article,
          tags: [...article.tags, tagInput.trim()]
        });
      }
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setArticle({
      ...article,
      tags: article.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle featured image upload
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setArticle({
          ...article,
          featuredImage: {
            file,
            preview: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    setArticle({
      ...article,
      featuredImage: null
    });
  };

  // Trigger the file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push({
          file,
          preview: reader.result
        });
        
        if (newImages.length === files.length) {
          setArticle({
            ...article,
            gallery: [...article.gallery, ...newImages]
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    const updatedGallery = [...article.gallery];
    updatedGallery.splice(index, 1);
    setArticle({
      ...article,
      gallery: updatedGallery
    });
  };

  // Trigger the gallery input click
  const triggerGalleryInput = () => {
    galleryInputRef.current.click();
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Save article
  const saveArticle = (status = article.status) => {
    // Here you would typically send the data to your API
    // For now, we'll just update the status and show a success message
    setArticle({
      ...article,
      status
    });
    alert(`Artikel berhasil disimpan sebagai ${status}`);
  };

  // Publish article
  const publishArticle = () => {
    if (article.title.trim() === "" || article.content.trim() === "") {
      alert("Judul dan konten artikel harus diisi");
      return;
    }
    saveArticle("Published");
  };

  // Format the preview content with basic Markdown-like styling
  const formatContent = (content) => {
    return content
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="p-1 bg-white">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tulis Artikel Baru</h1>
          <p className="text-gray-600 mt-1">Buat dan publikasikan artikel blog baru</p>
        </div>
        <div className="flex space-x-2">
          <a 
            href="/admin/blog" 
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 flex items-center hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Kembali
          </a>
          <button 
            onClick={togglePreview}
            className={`px-4 py-2 rounded-lg ${previewMode ? 'bg-[#50806B] text-white' : 'bg-gray-200 text-gray-700'} flex items-center hover:bg-[#3d6854] transition-colors`}
          >
            <FaEye className="mr-2" /> {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {!previewMode ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Title Input */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={article.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul artikel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                />
              </div>

              {/* Featured Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Utama
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFeaturedImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {article.featuredImage ? (
                  <div className="relative rounded-lg overflow-hidden mb-2 border-2 border-dashed border-gray-300">
                    <img
                      src={article.featuredImage.preview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={removeFeaturedImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Hapus gambar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <FaImage className="text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Klik untuk mengunggah gambar utama</p>
                    <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Max: 2MB)</p>
                  </div>
                )}
              </div>

              {/* Content Textarea */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Konten Artikel
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={article.content}
                  onChange={handleChange}
                  placeholder="Tulis konten artikel di sini..."
                  rows="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan format Markdown: # Judul, ## Sub Judul, **tebal**, *miring*
                </p>
              </div>

              {/* Gallery Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Galeri Gambar
                </label>
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryImagesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.gallery.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={image.preview}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        title="Hapus gambar"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                  
                  <div
                    onClick={triggerGalleryInput}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <FaPlus className="text-xl text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">Tambah</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Preview Mode */}
              <div className="border-b pb-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title || "Judul Artikel"}</h1>
                
                {article.featuredImage && (
                  <div className="mb-4">
                    <img
                      src={article.featuredImage.preview}
                      alt="Featured"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mr-2">
                    {article.category}
                  </span>
                  <span>Admin • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="article-content">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
                ) : (
                  <p className="text-gray-500 italic">Isi konten artikel akan ditampilkan di sini...</p>
                )}
              </div>
              
              {article.gallery.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Galeri</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {article.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image.preview}
                        alt={`Gallery ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {article.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Publication Options */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Publikasi</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    article.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                  <span>{article.status}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => saveArticle('Draft')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <FaSave className="mr-2" /> Simpan sebagai Draft
                </button>
                
                <button
                  onClick={publishArticle}
                  className="w-full px-4 py-2 rounded-lg bg-[#50806B] text-white flex items-center justify-center hover:bg-[#3d6854] transition-colors"
                >
                  <FaUpload className="mr-2" /> Publikasikan
                </button>
              </div>
            </div>
          </div>
          
          {/* Category & Tags */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Kategori & Tag</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  value={article.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTags className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Tambahkan tag..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (tagInput.trim() !== "" && !article.tags.includes(tagInput.trim())) {
                        setArticle({
                          ...article,
                          tags: [...article.tags, tagInput.trim()]
                        });
                        setTagInput("");
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#50806B] text-white hover:bg-[#3d6854] transition-colors"
                  >
                    <FaPlus />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tekan Enter untuk menambahkan tag</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Options */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Opsi Tambahan</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={article.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#50806B] focus:ring-[#50806B] border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Tampilkan sebagai artikel unggulan
                </label>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Petunjuk:</strong> Gunakan format markdown untuk konten:
                </p>
                <ul className="text-xs text-gray-500 list-disc list-inside mt-1 space-y-1">
                  <li># Judul Utama</li>
                  <li>## Sub Judul</li>
                  <li>### Sub-sub Judul</li>
                  <li>**Teks Tebal**</li>
                  <li>*Teks Miring*</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      {showUnsavedChangesModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Perubahan Belum Disimpan</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowUnsavedChangesModal(false);
                    window.location.href = "/admin/blog";
                  }}
                >
                  Ya, Tinggalkan
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowUnsavedChangesModal(false)}
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