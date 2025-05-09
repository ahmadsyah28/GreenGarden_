"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { produkTanaman } from "@/src/app/utils/data";

const DetailTanaman = ({ params }) => {
  const [tanaman, setTanaman] = useState(null);
  const [jumlah, setJumlah] = useState(1);

  useEffect(() => {
    // Mengambil id dari params.id dan mencari data tanaman sesuai id
    if (params?.id) {
      const tanamanData = produkTanaman.find(
        (item) => item.id === parseInt(params.id)
      );
      setTanaman(tanamanData);
    }
  }, [params]);

  const tambahJumlah = () => {
    setJumlah(jumlah + 1);
  };

  const kurangJumlah = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };

  if (!tanaman) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>Tanaman tidak ditemukan</p>
        <Link href="/tanaman-hias" className="text-[#50806B] font-semibold mt-4 inline-block">
          Kembali ke halaman tanaman
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
  

      {/* Tombol Kembali */}
      <div className="mb-6 ml-[77px]">
        <Link href="/tanaman-hias" className="flex items-center text-[#50806B] font-semibold">
          <IoArrowBack className="mr-2" />
          Kembali ke Tanaman Hias
        </Link>
      </div>

      {/* Detail Content */}
      <div className="flex flex-wrap mx-[77px] gap-10">
        {/* Gambar Tanaman */}
        <div className="w-full md:w-2/5">
          <div className="border-2 border-slate-300 rounded-xl shadow-md overflow-hidden">
            <img
              src={tanaman.src}
              alt={tanaman.nama}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Informasi Tanaman */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#404041] mb-3">{tanaman.nama}</h1>
          <p className="text-2xl text-[#50806B] font-semibold mb-6">{tanaman.harga}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Deskripsi</h2>
            <p className="text-gray-700">{tanaman.deskripsi}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Perawatan</h2>
            <p className="text-gray-700">{tanaman.perawatan}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#404041] mb-2">Kebutuhan</h2>
            <p className="text-gray-700">{tanaman.kebutuhan}</p>
          </div>
          
          {/* Jumlah */}
          <div className="flex items-center mb-8">
            <span className="text-lg font-semibold text-[#404041] mr-4">Jumlah:</span>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={kurangJumlah}
                className="px-3 py-1 text-xl font-semibold"
              >
                -
              </button>
              <span className="px-4 py-1 text-lg">{jumlah}</span>
              <button
                onClick={tambahJumlah}
                className="px-3 py-1 text-xl font-semibold"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Tombol Aksi */}
          <div className="flex gap-4">
            <button className="bg-[#50806B] text-white py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto">
              Tambah ke Keranjang
            </button>
            <button className="bg-white text-[#50806B] border-2 border-[#50806B] py-3 px-6 rounded-xl text-lg font-semibold w-full md:w-auto">
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Rekomendasi Tanaman Lain */}
      <div className="mt-16 mx-[77px]">
        <h2 className="text-2xl font-bold text-[#404041] mb-6">Tanaman Lainnya</h2>
        <div className="flex flex-wrap gap-6">
          {produkTanaman
            .filter((item) => item.id !== tanaman.id)
            .slice(0, 4)
            .map((produk) => (
              <div
                key={produk.id}
                className="w-[220px] h-[300px] border-slate-300 border-2 shadow-lg border-opacity-75 rounded-[10px]"
              >
                <img
                  src={produk.src}
                  alt={produk.nama}
                  className="w-full h-[150px] object-cover rounded-t-[10px]"
                />
                <p className="text-[#404041] font-semibold text-base mt-2 ml-3">{produk.nama}</p>
                <p className="text-[#404041] mt-2 ml-3">{produk.harga}</p>
                <Link
                  href={`/tanaman-hias/${produk.id}`}
                  className="block w-[90%] mx-auto bg-[#50806B] text-white py-2 rounded-xl text-center font-semibold text-lg mt-4"
                >
                  Detail
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailTanaman;