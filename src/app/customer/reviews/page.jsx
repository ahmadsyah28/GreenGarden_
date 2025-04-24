"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaStar, FaRegStar, FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';

// Data ulasan dummy
const reviewsData = [
  {
    id: 1,
    productId: 1,
    productName: "Marble Queen",
    productImage: "/images/tanaman/tanaman1.png",
    orderId: "GG-123456",
    orderDate: "15 April 2025",
    rating: 5,
    comment: "Tanaman datang dalam kondisi sangat baik, daun segar dan akar sehat. Packaging aman dan pengiriman cepat. Sangat puas dengan pembelian ini!",
    images: ["/images/review/review1.jpg", "/images/review/review2.jpg"],
    date: "18 April 2025",
    likes: 12,
    status: "published"
  },
  {
    id: 2,
    productId: 2,
    productName: "Neon Pothos",
    productImage: "/images/tanaman/tanaman2.png",
    orderId: "GG-123456",
    orderDate: "15 April 2025",
    rating: 4,
    comment: "Tanaman dalam kondisi baik, hanya sedikit kuning di beberapa daun. Tapi setelah saya rawat seminggu, sudah mulai tumbuh daun baru yang bagus.",
    images: [],
    date: "18 April 2025",
    likes: 3,
    status: "published"
  },
  {
    id: 3,
    productId: 8,
    productName: "Aglonema Red",
    productImage: "/images/tanaman/tanaman8.png",
    orderId: "GG-123456",
    orderDate: "15 April 2025",
    rating: 5,
    comment: "Warnanya benar-benar cantik! Sesuai foto dan deskripsi. Ukurannya juga lumayan besar untuk harganya. Sangat senang dengan pembelian ini.",
    images: ["/images/review/review3.jpg"],
    date: "19 April 2025",
    likes: 8,
    status: "published"
  },
  {
    id: 4,
    productId: 5,
    productName: "Taman Minimalis Modern",
    productImage: "/images/desain/desain1.png",
    orderId: "GG-234567",
    orderDate: "23 April 2025",
    status: "pending",
    orderStatus: "Selesai"
  }
];

// Pending reviews
const pendingReviews = reviewsData.filter(review => review.status === "pending");
const publishedReviews = reviewsData.filter(review => review.status === "published");

// Star rating component
const StarRating = ({ rating, setRating, editable = false, size = "text-xl" }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (editable) {
      stars.push(
        <button 
          key={i} 
          onClick={() => setRating(i)}
          className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition`}
        >
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </button>
      );
    } else {
      stars.push(
        <span 
          key={i} 
          className={`${size} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
  }
  
  return <div className="flex">{stars}</div>;
};

// Review item component
const ReviewItem = ({ review, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={review.productImage}
            alt={review.productName}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="ml-4 flex-grow">
          <div className="flex justify-between">
            <h3 className="font-medium text-[#404041]">{review.productName}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEdit(review.id)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit review"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => onDelete(review.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete review"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-2">Pesanan {review.orderId} • {review.date}</p>
          
          <div className="mb-2">
            <StarRating rating={review.rating} />
          </div>
          
          <p className="text-gray-700 mb-3">{review.comment}</p>
          
          {review.images && review.images.length > 0 && (
            <div className="flex space-x-2 mb-3">
              {review.images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            {review.likes > 0 && <span>{review.likes} orang menganggap ulasan ini bermanfaat</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pending review item component
const PendingReviewItem = ({ review, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(review.id, { rating, comment, images });
      setLoading(false);
    }, 1000);
  };
  
  // Dummy function for image upload
  const handleImageUpload = (e) => {
    // In a real app, this would upload images to server
    // Here we just simulate adding local file URLs
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={review.productImage}
            alt={review.productName}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="ml-4 flex-grow">
          <h3 className="font-medium text-[#404041]">{review.productName}</h3>
          <p className="text-sm text-gray-500 mb-3">Pesanan {review.orderId} • {review.orderDate}</p>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Beri Rating</label>
            <StarRating rating={rating} setRating={setRating} editable={true} />
          </div>
          
          <div className="mb-4">
            <label htmlFor={`comment-${review.id}`} className="block text-gray-700 font-medium mb-2">
              Ulasan Anda
            </label>
            <textarea
              id={`comment-${review.id}`}
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalaman Anda tentang produk ini..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Tambahkan Foto (Opsional)
            </label>
            <div className="flex items-center space-x-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="relative w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-[#50806B] transition">
                  <span className="text-2xl text-gray-400">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    multiple={images.length < 2}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Maks. 3 foto, ukuran maks. 5MB per foto</p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className="bg-[#50806B] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedReviews, setDisplayedReviews] = useState(publishedReviews);
  const [editingReview, setEditingReview] = useState(null);
  
  // Filter reviews based on search query
  useEffect(() => {
    const reviews = activeTab === 'published' ? publishedReviews : pendingReviews;
    
    if (searchQuery.trim() === '') {
      setDisplayedReviews(reviews);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = reviews.filter(review => 
        review.productName.toLowerCase().includes(query) ||
        (review.comment && review.comment.toLowerCase().includes(query))
      );
      setDisplayedReviews(filtered);
    }
  }, [searchQuery, activeTab]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setDisplayedReviews(tab === 'published' ? publishedReviews : pendingReviews);
  };
  
  // Handle submit review
  const handleSubmitReview = (id, reviewData) => {
    // In a real app, this would update the database
    alert(`Ulasan untuk produk ID ${id} telah dikirim: ${JSON.stringify(reviewData)}`);
    // Update local state
    const updatedPendingReviews = pendingReviews.filter(review => review.id !== id);
    setDisplayedReviews(updatedPendingReviews);
  };
  
  // Handle edit review
  const handleEditReview = (id) => {
    setEditingReview(id);
    // In a real app, this would open an edit form
    alert(`Edit ulasan untuk ID ${id}`);
  };
  
  // Handle delete review
  const handleDeleteReview = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      // In a real app, this would update the database
      const updatedReviews = displayedReviews.filter(review => review.id !== id);
      setDisplayedReviews(updatedReviews);
      alert(`Ulasan ID ${id} telah dihapus`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/account" className="flex items-center text-[#50806B] hover:underline mr-4">
          <FaArrowLeft className="mr-2" />
          Kembali ke Akun
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-[#404041]">Ulasan Saya</h1>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'published' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => handleTabChange('published')}
          >
            Ulasan Saya ({publishedReviews.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-[#50806B] border-b-2 border-[#50806B]' : 'text-gray-500'}`}
            onClick={() => handleTabChange('pending')}
          >
            Menunggu Ulasan ({pendingReviews.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk atau ulasan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#50806B]"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Reviews Content */}
      <div>
        {activeTab === 'published' ? (
          displayedReviews.length > 0 ? (
            displayedReviews.map(review => (
              <ReviewItem 
                key={review.id} 
                review={review} 
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaStar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-[#404041] mb-2">Belum ada ulasan</h3>
              <p className="text-gray-500 mb-6">Anda belum memberikan ulasan untuk produk apapun.</p>
              <Link href="/account/orders" className="inline-block bg-[#50806B] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
                Lihat Pesanan Selesai
              </Link>
            </div>
          )
        ) : (
          // Pending Reviews
          displayedReviews.length > 0 ? (
            displayedReviews.map(review => (
              <PendingReviewItem 
                key={review.id} 
                review={review} 
                onSubmit={handleSubmitReview}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaStar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-[#404041] mb-2">Tidak ada produk yang menunggu ulasan</h3>
              <p className="text-gray-500 mb-6">Anda telah memberikan ulasan untuk semua produk yang telah dibeli.</p>
              <Link href="/" className="inline-block bg-[#50806B] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition">
                Terus Belanja
              </Link>
            </div>
          )
        )}
      </div>

      {/* Review Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Tips Menulis Ulasan yang Baik</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Ceritakan pengalaman Anda dengan produk secara detail</li>
          <li>Tambahkan foto untuk menunjukkan kondisi produk</li>
          <li>Berikan informasi yang objektif dan bermanfaat bagi pembeli lain</li>
          <li>Jelaskan kelebihan dan kelemahan produk</li>
          <li>Sebutkan apakah produk sesuai dengan deskripsi</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewsPage;