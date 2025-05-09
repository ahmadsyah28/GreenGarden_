import React from "react";
import Link from "next/link";
import StatisticsSection from "@/components/StatisticsSection";
import { FaArrowRight } from "react-icons/fa";

const layananKami = [
  {
    title: "Tanaman Hias",
    img: "/images/tanaman.png",
    desc: "Koleksi tanaman hias berkualitas untuk mempercantik rumah Anda.",
  },
  {
    title: "Perawatan Tanaman",
    img: "/images/penyiram.png",
    desc: "Perawatan berkala untuk memastikan tanaman tetap sehat dan subur.",
  },
  {
    title: "Desain Taman",
    img: "/images/desain.png",
    desc: "Desain taman yang estetis dan fungsional sesuai kebutuhan Anda.",
  },
];

const galeriImages = [
  "/images/galeri/taman3.jpg",
  "/images/galeri/taman1.jpg",
  "/images/galeri/taman2.jpg",
  "/images/galeri/taman5.jpg",
  "/images/galeri/taman6.jpg",
  "/images/galeri/taman1.jpg",
  "/images/galeri/taman2.jpg",
];

const testimoni = [
  {
    nama: "Jessica Watson",
    img: "/images/testimoni/testimoni1.png",
    ulasan:
      "Sangat merekomendasikan situs ini untuk bunga dan tanaman berkualitas. Harga bagus, pengiriman tepat waktu, dan layanan pelanggan sangat baik.",
  },
  {
    nama: "Grace Tarigan",
    img: "/images/testimoni/testimoni2.png",
    ulasan:
      "Pelayanan memuaskan dan tanaman yang saya beli tumbuh dengan baik. GreenGarden sangat peduli dengan kualitas!",
  },
  {
    nama: "Amanda Rahma",
    img: "/images/testimoni/testimoni3.png",
    ulasan:
      "Desain taman dari GreenGarden membuat halaman rumah saya terlihat jauh lebih asri dan nyaman.",
  },
];

const Home = () => {
  return (
    <div className="container mx-auto py-8 flex flex-col bg-white">
      {/* TAGLINE */}
      <section className="flex flex-col md:flex-row items-center px-[77px]">
        <div className="md:w-1/2 space-y-5 px-8">
          <h1 className="font-bold text-4xl text-[#404041] leading-snug">
            Kami hadir untuk Menjadikan <br /> Rumah Anda Lebih <br />
            Hijau dan Asri
          </h1>
          <p>
            Perawatan adalah kunci utama kebun yang sehat,
            <br /> indah, dan produktif. Ciptakan ruang hijau terbaik <br />
            bersama <span className="text-[#50806B]">Green</span>Garden.
          </p>
          <div className="flex gap-4">
            <Link
              href="/get-started"
              className="bg-[#50806B] rounded-[20px] py-2 px-3 text-white font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/learn-more"
              className="bg-[#404041] text-white rounded-[20px] py-2 px-3 font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img
            src="/images/greenspace3.jpg"
            alt="tagline"
            className="w-full max-w-[600px] mx-auto"
          />
        </div>
      </section>

      {/* EXPERIENCE */}
      <StatisticsSection />

      {/* LAYANAN KAMI */}
      <section className="bg-[#1F2233] py-16">
        <div className="text-center mb-10">
          <p className="text-[#ECE57E] text-2xl font-semibold">Layanan Kami</p>
          <p className="text-white text-4xl font-bold">Penawaran Kami</p>
        </div>
        <div className="flex justify-around flex-wrap gap-10">
          {layananKami.map((layanan, idx) => (
            <div key={idx} className="w-[300px] text-left text-white">
              <img src={layanan.img} alt={layanan.title} className="w-16" />
              <h3 className="text-xl font-semibold mt-5">{layanan.title}</h3>
              <p className="mt-3 text-base font-light">{layanan.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG KAMI */}
      <section className="flex flex-col md:flex-row items-center my-10 px-[77px]">
        <div className="md:w-1/2  p-4">
          <img
            src="/images/greenspace1.jpg"
            alt="tentang kami"
            className="mx-auto w-[500px] rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 p-4 px-40 ">
          <h2 className="text-[#A7A151] text-3xl font-bold mb-4">
            Tentang Kami
          </h2>
          <p className="text-xl text-[#404041] leading-relaxed text-justify">
            <span className="font-semibold">
              <span className="text-[#50806B]">Green</span>Garden
            </span>{" "}
            adalah platform e-commerce dan jasa layanan yang berfokus pada semua
            kebutuhan pertamanan dan tanaman hias. Konsep dasar dari GreenGarden
            adalah menciptakan solusi lengkap bagi masyarakat yang ingin
            memiliki taman indah atau ruang hijau, namun memiliki keterbatasan
            waktu, pengetahuan, atau ruang.
          </p>
        </div>
      </section>

      {/* GALERI */}
      <section className="my-10 px-[77px]">
        <h2 className="text-[#50806B] text-3xl font-bold text-center mb-10">
          Galeri Kami
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-start gap-4 px-6">
          <img
            src={galeriImages[0]}
            alt="galeri utama"
            className="w-[320px] rounded-lg transition-transform duration-300 ease-in-out hover:scale-102"
          />

          <div className="grid grid-cols-3 gap-2">
            {galeriImages.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`galeri-${idx}`}
                className="w-[300px] rounded-md transition-transform duration-300 ease-in-out hover:scale-102"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4 px-10">
          <Link
            href="/galeri"
            className="flex items-center text-[#404041] text-2xl font-semibold hover:underline"
          >
            Lihat Semua <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="my-20 text-center px-[77px]">
        <h2 className="text-2xl font-bold text-[#50806B] mb-10">
          Testimoni Mereka
        </h2>
        <div className="flex flex-wrap justify-center gap-40">
          {testimoni.map((t, idx) => (
            <div key={idx} className="max-w-[220px] text-left">
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={t.img}
                  alt={t.nama}
                  className="w-16 h-16 rounded-full"
                />
                <p className="text-[#50806B] text-lg font-semibold">{t.nama}</p>
              </div>
              <p className="text-[#404041] text-sm leading-relaxed text-justify">
                "{t.ulasan}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;