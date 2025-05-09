'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Sample blog data - in a real app, this would likely come from an API or CMS
const blogPosts = [
  {
    id: 1,
    featured: true,
    title: "Awas Bubble Economy & Monkey Business Mahalnya Tanaman Hias",
    excerpt: "Belakangan ini eksistensi tanaman hias semakin naik daun. Ini lantaran pandemi virus corona membuat sebagian besar mobilitas masyarakat di rumah lebih besar dibanding di luar rumah",
    type: "Blog",
    image: "/images/blog/blog1.png",
    author: {
      name: "Kate Szu",
      avatar: "/images/testimoni/testimoni3.png"
    },
    slug: "bubble-economy-tanaman-hias"
  },
  {
    id: 2,
    featured: false,
    title: "Bunga Matahari: Simbol Kecantikan dan Harapan",
    excerpt: "Apakah kamu sedang mencari arti bunga matahari? Kamu mungkin salah satu orang yang mendengar lagu Gala Bunga Matahari dari Sal",
    type: "Artikel",
    image: "/images/blog/blog2.png",
    author: {
      name: "Kate Szu",
      avatar: "/images/testimoni/testimoni3.png"
    },
    slug: "arti-bunga-matahari"
  },
  {
    id: 3,
    featured: false,
    title: "Desain Taman Hotel: Strategi Cerdas Tingkatkan",
    excerpt: "Desain taman yang indah dan fungsional memegang peranan penting dalam meningkatkan daya tarik hotel, menciptakan suasana nyaman bagi tamu...",
    type: "Blog",
    image: "/images/blog/blog3.png",
    author: {
      name: "Grace Tarigan",
      avatar: "/images/testimoni/testimoni2.png"
    },
    slug: "desain-taman-hotel"
  },
  {
    id: 4,
    featured: false,
    title: "Bunga Matahari: Simbol Kecantikan dan Harapan",
    excerpt: "Apakah kamu sedang mencari arti bunga matahari? Kamu mungkin salah satu orang yang mendengar lagu Gala Bunga Matahari dari Sal",
    type: "Artikel",
    image: "/images/blog/blog2.png",
    author: {
      name: "Kate Szu",
      avatar: "/images/testimoni/testimoni3.png"
    },
    slug: "arti-bunga-matahari-2"
  },
  {
    id: 5,
    featured: false,
    title: "Desain Taman Hotel: Strategi Cerdas Tingkatkan",
    excerpt: "Desain taman yang indah dan fungsional memegang peranan penting dalam meningkatkan daya tarik hotel, menciptakan suasana nyaman bagi tamu...",
    type: "Blog",
    image: "/images/blog/blog3.png",
    author: {
      name: "Grace Tarigan",
      avatar: "/images/testimoni/testimoni2.png"
    },
    slug: "desain-taman-hotel-2"
  }
];

// Featured blog post component
const FeaturedPost = ({ post }) => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 md:gap-10 bg-white">
      <div className="w-full md:w-1/2">
        <div className="relative w-full aspect-[4/3] md:h-[400px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover rounded-2xl border border-slate-200  shadow-2xl shadow-gray-500/50"
            priority
          />
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <div className="py-1 px-5 border border-slate-500 rounded-[20px] inline-block bg-[#50806B] mb-5">
          <p className="font-bold text-white">{post.type}</p>
        </div>
        <h2 className="text-[#404041] text-2xl md:text-3xl font-bold mb-5 leading-tight">
          {post.title}
        </h2>
        <p className="text-base md:text-xl text-justify mb-6 md:mb-10">
          {post.excerpt}{" "}
          <Link href={`/blog/${post.slug}`} className="text-blue-700">
            ... baca selengkapnya
          </Link>
        </p>
        <div className="flex items-center">
          <div className="relative w-12 md:w-16 h-12 md:h-16">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="ml-3 text-[#50806B] text-lg font-semibold">
            {post.author.name}
          </p>
        </div>
      </div>
    </div>
  );
};

// Blog card component
const BlogCard = ({ post }) => {
  return (
    <div className="flex flex-col w-full sm:w-[300px] rounded-[20px] border border-slate-300 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full">
      <div className="relative w-full h-48">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="py-1 px-2 border border-slate-500 rounded-xl bg-[#50806B]  w-fit">
          <p className="font-thin text-white text-sm">{post.type}</p>
        </div>
        
        <h3 className="font-semibold text-xl text-[#404041] mb-1 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-[#404041] font-thin mb-1 flex-grow text-justify">
          {post.excerpt}
        </p>
        
        <div className="flex items-center mt-auto">
          <div className="relative w-10 h-10">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="ml-2 text-[#50806B] text-base font-semibold">
            {post.author.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Blog() {
  // Separate featured post from regular posts
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="container mx-auto px-4 md:px-[77px] py-8">
      <h1 className="text-2xl md:text-3xl text-[#343D33] font-semibold">
        Blogs & Updates
      </h1>

      {/* Featured blog post */}
      <section className="mt-6 md:mt-10">
        {featuredPost && <FeaturedPost post={featuredPost} />}
      </section>

      {/* Other blog posts */}
      <section className="mt-12 md:mt-16">
        <h2 className="text-[#404041] text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-10">
          <span className="border-b-2 border-[#50806B] pb-2">Baca Berita Lainnya</span>
        </h2>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {regularPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}