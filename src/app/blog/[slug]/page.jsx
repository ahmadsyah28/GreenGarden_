'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn, FaWhatsapp, FaClock } from "react-icons/fa";

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
      avatar: "/images/testimoni/testimoni3.png",
      bio: "Horticulturist dan penulis dengan pengalaman lebih dari 10 tahun dalam budidaya tanaman hias. Dia senang berbagi pengetahuan seputar tren tanaman dan perawatannya."
    },
    slug: "bubble-economy-tanaman-hias",
    date: "15 Maret 2023",
    readTime: "7 min read",
    content: `
      <h2>Tren Tanaman Hias Saat Pandemi</h2>
      <p>Belakangan ini eksistensi tanaman hias semakin naik daun. Ini lantaran pandemi virus corona membuat sebagian besar mobilitas masyarakat di rumah lebih besar dibanding di luar rumah. Sehingga banyak yang berlomba-lomba membeli, koleksi, hingga menjual aneka tanaman hias.</p>
      
      <p>Menjamurnya tanaman hias juga seakan-akan membuat segala orang dari berbagai kalangan ikut mengoleksi mulai dari anak-anak, remaja, hingga para ibu rumah tangga. Begitu bernaungnya tanaman hias karena muncul komunitas-komunitas "Crazy Plant People" di beberapa kota salah satunya Salatiga.</p>
      
      <p>Tapi kalau kita mau telusuri lebih dalam, sebenernya fenomena naiknya harga tanaman hias itu udah pernah terjadi empat kali di Indonesia.</p>
      
      <h2>Sejarah Tanaman Hias di Indonesia</h2>
      
      <p>Booming tanaman hias pertama kali terjadi pada 1997-1998 jenis yang melonjak tinggi adalah anggrek hitam, kemudian booming yang kedua adalah pada tahun 2011-2012 jenis yang harganya melonjak naik adalah bunga adenium dan sampai puncaknya ketika booming ketiga pada tahun 2012-2013 banyak tanaman sejenis aglonema atau sri rejeki pada saat itu harga bisa mencapai jutaan.</p>
      
      <p>Dan sekarang udah booming yang keempat nih guys, mungkin ada yang udah sadar kalau misalnya pandemi covid-19 ini memicu kenaikan harga tanaman-tanaman hias yang dulunya kita bisa bilang worth it, tapi sekarang dengan harga yang begitu tinggi kita jadi ragu buat beli karena ke mahal-mahal. Gua punya dua tanaman hias yang paling sering diomongin akhir-akhir ini dan harganya tuh bener-bener naik banget. Yang pertama adalah monstera, kedua adalah janda bolong.</p>
      
      <h2>Fenomena Bubble Economy</h2>
      
      <p>Fenomena naiknya harga tanaman hias dan hewan peliharaan ini di dunia ekonomi disebut sebagai gelembung ekonomi atau bubble economy atau juga bisa disebut economic bubble yang sama seperti tulip mania pada tahun 1637 di Belanda.</p>
      
      <p>Jadi tulip mania itu adalah tentang bagaimana harga bunga tulip itu meningkat luar biasa pada saat itu. Kalau kita lihat, tulip pernah jadi bunga yang paling banyak diperebutkan oleh orang-orang Belanda dan Eropa pada saat itu. Kenapa? jadi pada saat itu bunga tulip merupakan tumbuhan eksotis yang baru diimpor dari Turki. Si bunga tulip ini punya penyakit yang disebabkan oleh virus mozaik yang bikin si bunga tulip punya corak warna yang berbeda-beda makanya orang-orang pada saat itu berlomba-lomba untuk mengumpulkan tulip dengan corak yang langka atau yang gak biasa.</p>
      
      <blockquote>
        "Kita jangan terlalu euforia dengan kemajuan tanaman hias karena tanaman itu pada dasarnya adalah tanaman yang harganya bisa berubah-ubah fluktuatif dan cenderung akan turun jika sudah banyak diperjualbelikan."
      </blockquote>
      
      <h2>Investasi Tanaman Hias yang Bijak</h2>
      
      <p>Bagi yang tertarik mengoleksi tanaman hias, ada beberapa tips yang bisa Anda pertimbangkan:</p>
      
      <ol>
        <li>Koleksilah tanaman yang Anda sukai, bukan semata-mata untuk investasi</li>
        <li>Pelajari cara perawatan yang benar untuk menjaga nilai tanaman</li>
        <li>Diversifikasi koleksi Anda, jangan hanya fokus pada satu jenis tanaman</li>
        <li>Tetap waspada terhadap tren dan fluktuasi harga</li>
        <li>Bergabunglah dengan komunitas pecinta tanaman untuk berbagi pengalaman dan pengetahuan</li>
      </ol>
      
      <h2>Kesimpulan</h2>
      
      <p>Fenomena naiknya harga tanaman hias selama pandemi merupakan siklus yang pernah terjadi sebelumnya. Meski menarik sebagai investasi jangka pendek, penting untuk bijak dalam mengalokasikan dana untuk hobi ini. Kecintaan terhadap tanaman seharusnya menjadi motivasi utama, bukan semata keuntungan finansial yang mungkin bersifat sementara.</p>
    `,
    tags: ["Tanaman Hias", "Investasi", "Tren", "Bubble Economy", "Pandemi"],
    relatedPosts: [2, 3]
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
      avatar: "/images/testimoni/testimoni3.png",
      bio: "Horticulturist dan penulis dengan pengalaman lebih dari 10 tahun dalam budidaya tanaman hias. Dia senang berbagi pengetahuan seputar tren tanaman dan perawatannya."
    },
    slug: "arti-bunga-matahari",
    date: "22 April 2023",
    readTime: "5 min read",
    content: `
      <h2>Arti Bunga Matahari dalam Berbagai Budaya</h2>
      <p>Bunga matahari atau sunflower (Helianthus annuus) adalah salah satu bunga yang paling dikenal di dunia. Dengan kelopak kuningnya yang cerah dan tengahnya yang berwarna coklat gelap, bunga ini dikenal karena kebiasaannya mengikuti pergerakan matahari dari timur ke barat sepanjang hari.</p>
      
      <p>Dalam berbagai budaya, bunga matahari memiliki arti yang beragam tetapi umumnya positif. Di banyak tradisi, bunga matahari melambangkan kesetiaan, kebahagiaan, dan kehangatan. Bunga ini juga sering dikaitkan dengan matahari itu sendiri, yang merupakan simbol kehidupan dan energi.</p>
      
      <h2>Simbolisme Bunga Matahari</h2>
      
      <p>Bunga matahari memiliki beberapa makna simbolis yang mendalam:</p>
      
      <ul>
        <li><strong>Kesetiaan:</strong> Karena bunga matahari selalu menghadap ke arah matahari, bunga ini sering dijadikan simbol kesetiaan dan dedikasi.</li>
        <li><strong>Kebahagiaan:</strong> Warna kuning cerah pada kelopaknya melambangkan kegembiraan, optimisme, dan energi positif.</li>
        <li><strong>Harapan:</strong> Bunga matahari juga sering dikaitkan dengan harapan dan ketahanan, karena kemampuannya untuk tumbuh tinggi dan kuat.</li>
        <li><strong>Kehidupan Baru:</strong> Biji bunga matahari yang melimpah melambangkan kelimpahan dan kemungkinan kehidupan baru.</li>
      </ul>
      
      <blockquote>
        "Bunga matahari adalah bunga yang luar biasa, karena meskipun memiliki akar yang tertanam di tanah, mereka selalu mencari cahaya."
      </blockquote>
      
      <h2>Bunga Matahari dalam Seni dan Budaya Populer</h2>
      
      <p>Bunga matahari telah menginspirasi banyak seniman sepanjang sejarah. Salah satu karya paling terkenal yang menampilkan bunga matahari adalah seri lukisan "Sunflowers" oleh Vincent van Gogh. Lukisan-lukisan ini mencerminkan kecantikan sederhana namun mencolok dari bunga matahari dan telah menjadi ikon dalam dunia seni.</p>
      
      <p>Dalam budaya populer Indonesia, bunga matahari menjadi populer melalui lagu "Gala Bunga Matahari" yang dinyanyikan oleh Sal Priadi. Lagu ini menggambarkan bunga matahari sebagai simbol cinta, harapan, dan kesetiaan.</p>
      
      <h2>Cara Menanam dan Merawat Bunga Matahari</h2>
      
      <p>Jika Anda tertarik untuk menanam bunga matahari, berikut adalah beberapa tips:</p>
      
      <ol>
        <li>Pilih lokasi yang mendapatkan sinar matahari penuh setidaknya 6-8 jam per hari</li>
        <li>Tanam biji sekitar 2,5 cm ke dalam tanah yang sudah digemburkan</li>
        <li>Jaga kelembaban tanah tetapi hindari penyiraman berlebihan</li>
        <li>Berikan pupuk secukupnya untuk mendukung pertumbuhan yang optimal</li>
        <li>Tunggu sekitar 80-120 hari untuk bunga mekar sepenuhnya</li>
      </ol>
      
      <h2>Kesimpulan</h2>
      
      <p>Bunga matahari adalah simbol universal kebahagiaan, kesetiaan, dan harapan. Dengan keindahannya yang mencolok dan maknanya yang dalam, tidak mengherankan jika bunga ini telah menjadi favorit di seluruh dunia. Baik sebagai elemen dekoratif, subjek inspirasi artistik, atau tanaman di kebun Anda, bunga matahari selalu membawa energi positif dan kegembiraan.</p>
    `,
    tags: ["Bunga Matahari", "Simbolisme", "Tanaman Hias", "Kebahagiaan", "Budaya"],
    relatedPosts: [1, 5]
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
      avatar: "/images/testimoni/testimoni2.png",
      bio: "Arsitek lansekap profesional dengan spesialisasi dalam desain taman untuk properti komersial. Grace telah merancang lebih dari 50 taman hotel di seluruh Indonesia."
    },
    slug: "desain-taman-hotel",
    date: "5 Mei 2023",
    readTime: "10 min read",
    content: `
      <h2>Pentingnya Desain Taman dalam Industri Perhotelan</h2>
      <p>Desain taman yang indah dan fungsional memegang peranan penting dalam meningkatkan daya tarik hotel, menciptakan suasana nyaman bagi tamu, serta menambah nilai estetika dan ekonomi properti. Dalam industri perhotelan yang sangat kompetitif, taman hotel tidak lagi sekadar elemen dekoratif, tetapi telah menjadi aset strategis yang dapat meningkatkan pengalaman tamu dan membedakan hotel dari pesaingnya.</p>
      
      <p>Menurut survei terbaru dari Asosiasi Perhotelan Indonesia, hotel dengan taman yang dirancang dengan baik mengalami peningkatan tingkat kepuasan tamu hingga 35% dan dapat menaikkan tarif kamar rata-rata sebesar 15-20% dibandingkan properti serupa tanpa lansekap yang menarik.</p>
      
      <h2>Tren Desain Taman Hotel di Indonesia</h2>
      
      <p>Beberapa tren desain taman hotel yang sedang berkembang di Indonesia meliputi:</p>
      
      <ul>
        <li><strong>Taman Lokal yang Otentik:</strong> Penggunaan tanaman dan elemen desain yang mencerminkan budaya dan ekosistem lokal.</li>
        <li><strong>Kebun Organik:</strong> Area tanam yang menyediakan bahan makanan segar untuk restoran hotel.</li>
        <li><strong>Ruang Multifungsi:</strong> Taman yang dirancang untuk mengakomodasi berbagai kegiatan, dari pernikahan hingga yoga pagi.</li>
        <li><strong>Elemen Air yang Dramatis:</strong> Fitur air seperti kolam, air mancur, atau aliran air yang menciptakan atmosfer menenangkan.</li>
        <li><strong>Taman Vertikal:</strong> Pemanfaatan dinding hijau untuk memaksimalkan ruang dan menambah keindahan visual.</li>
      </ul>
      
      <blockquote>
        "Taman hotel yang dirancang dengan baik tidak hanya menciptakan kesan pertama yang mengesankan, tetapi juga pengalaman yang tak terlupakan yang membuat tamu ingin kembali."
      </blockquote>
      
      <h2>Strategi Merancang Taman Hotel yang Efektif</h2>
      
      <p>Untuk menciptakan desain taman hotel yang mampu meningkatkan daya tarik dan nilai properti, pertimbangkan strategi berikut:</p>
      
      <ol>
        <li><strong>Selaraskan dengan Identitas Merek:</strong> Pastikan desain taman mencerminkan tema, nilai, dan positioning hotel Anda.</li>
        <li><strong>Prioritaskan Pengalaman Tamu:</strong> Ciptakan ruang yang memenuhi kebutuhan tamu untuk bersantai, bersosialisasi, atau beraktivitas.</li>
        <li><strong>Pertimbangkan Pemeliharaan:</strong> Pilih tanaman dan material yang indah namun tidak memerlukan perawatan intensif.</li>
        <li><strong>Integrasikan Teknologi:</strong> Tambahkan pencahayaan cerdas, WiFi outdoor, atau stasiun pengisian daya untuk meningkatkan fungsionalitas.</li>
        <li><strong>Ciptakan Ruang Instagramable:</strong> Desain area yang menarik secara visual dan mendorong tamu untuk berbagi di media sosial.</li>
      </ol>
      
      <h2>Studi Kasus: Hotel Bali Dynasty Resort</h2>
      
      <p>Bali Dynasty Resort di Kuta berhasil meningkatkan tingkat hunian sebesar 23% setelah melakukan renovasi taman mereka. Desain baru menggabungkan elemen Bali tradisional dengan kenyamanan modern, menciptakan oasis tropis yang memikat di tengah area wisata yang ramai. Fitur utama termasuk kolam renang dengan air terjun, gazebo privat, dan taman herbal yang memasok restoran hotel.</p>
      
      <h2>Tantangan dan Solusi</h2>
      
      <p>Desain taman hotel di Indonesia menghadapi beberapa tantangan, termasuk:</p>
      
      <ul>
        <li><strong>Iklim Tropis:</strong> Pilih tanaman yang tahan panas dan kelembaban tinggi.</li>
        <li><strong>Lahan Terbatas:</strong> Manfaatkan taman vertikal dan desain bertingkat.</li>
        <li><strong>Biaya Pemeliharaan:</strong> Terapkan sistem irigasi otomatis dan pilih tanaman tahan kekeringan.</li>
        <li><strong>Hama:</strong> Gunakan metode pengendalian hama terpadu yang ramah lingkungan.</li>
      </ul>
      
      <h2>Kesimpulan</h2>
      
      <p>Investasi dalam desain taman hotel yang cerdas bukan lagi sekadar pilihan, tetapi kebutuhan strategis dalam industri perhotelan modern. Dengan memadukan unsur estetika, fungsionalitas, dan keberlanjutan, taman hotel dapat menjadi pembeda yang signifikan, meningkatkan kepuasan tamu, dan pada akhirnya mendorong pertumbuhan pendapatan hotel.</p>
    `,
    tags: ["Desain Taman", "Hotel", "Lansekap", "Hospitality", "Strategi Bisnis"],
    relatedPosts: [1, 5]
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
      avatar: "/images/testimoni/testimoni3.png",
      bio: "Horticulturist dan penulis dengan pengalaman lebih dari 10 tahun dalam budidaya tanaman hias. Dia senang berbagi pengetahuan seputar tren tanaman dan perawatannya."
    },
    slug: "arti-bunga-matahari-2",
    date: "22 April 2023",
    readTime: "5 min read",
    content: `
      <h2>Arti Bunga Matahari dalam Berbagai Budaya</h2>
      <p>Bunga matahari atau sunflower (Helianthus annuus) adalah salah satu bunga yang paling dikenal di dunia. Dengan kelopak kuningnya yang cerah dan tengahnya yang berwarna coklat gelap, bunga ini dikenal karena kebiasaannya mengikuti pergerakan matahari dari timur ke barat sepanjang hari.</p>
      
      <p>Dalam berbagai budaya, bunga matahari memiliki arti yang beragam tetapi umumnya positif. Di banyak tradisi, bunga matahari melambangkan kesetiaan, kebahagiaan, dan kehangatan. Bunga ini juga sering dikaitkan dengan matahari itu sendiri, yang merupakan simbol kehidupan dan energi.</p>
    `,
    tags: ["Bunga Matahari", "Simbolisme", "Tanaman Hias"],
    relatedPosts: [2, 5]
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
      avatar: "/images/testimoni/testimoni2.png",
      bio: "Arsitek lansekap profesional dengan spesialisasi dalam desain taman untuk properti komersial. Grace telah merancang lebih dari 50 taman hotel di seluruh Indonesia."
    },
    slug: "desain-taman-hotel-2",
    date: "5 Mei 2023",
    readTime: "10 min read",
    content: `
      <h2>Pentingnya Desain Taman dalam Industri Perhotelan</h2>
      <p>Desain taman yang indah dan fungsional memegang peranan penting dalam meningkatkan daya tarik hotel, menciptakan suasana nyaman bagi tamu, serta menambah nilai estetika dan ekonomi properti. Dalam industri perhotelan yang sangat kompetitif, taman hotel tidak lagi sekadar elemen dekoratif, tetapi telah menjadi aset strategis yang dapat meningkatkan pengalaman tamu dan membedakan hotel dari pesaingnya.</p>
    `,
    tags: ["Desain Taman", "Hotel", "Lansekap"],
    relatedPosts: [3, 1]
  }
];

// Related post card component
const RelatedPostCard = ({ post }) => {
  return (
    <div className="flex space-x-4">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div>
        <p className="text-[#50806B] text-sm font-semibold">{post.type}</p>
        <h4 className="text-[#404041] font-semibold line-clamp-2">{post.title}</h4>
        <Link href={`/blog/${post.slug}`} className="text-blue-600 text-sm hover:underline">
          Baca selengkapnya
        </Link>
      </div>
    </div>
  );
};

const ShareButtons = ({ title, slug }) => {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${slug}`;
  
  return (
    <div className="flex space-x-2 items-center">
      <span className="text-[#404041] font-medium">Bagikan:</span>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
        aria-label="Share on Facebook"
      >
        <FaFacebookF size={14} />
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition"
        aria-label="Share on Twitter"
      >
        <FaTwitter size={14} />
      </a>
      <a 
        href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&media=&description=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
        aria-label="Share on Pinterest"
      >
        <FaPinterestP size={14} />
      </a>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn size={14} />
      </a>
      <a 
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title)} ${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp size={14} />
      </a>
    </div>
  );
};

const BlogDetail = ({ params: paramsPromise }) => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  const params = React.use(paramsPromise); // Unwrap the params Promise

  useEffect(() => {
    // Find the blog post by slug
    const currentPost = blogPosts.find(post => post.slug === params.slug);
    
    if (currentPost) {
      setPost(currentPost);
      
      // Get related posts if they exist
      if (currentPost.relatedPosts && currentPost.relatedPosts.length > 0) {
        const related = blogPosts.filter(p => currentPost.relatedPosts.includes(p.id));
        setRelatedPosts(related);
      }
    }
  }, [params.slug]);

  // If post not found
  if (!post) {
    return (
      <div className="container mx-auto px-4 md:px-[77px] py-16 text-center">
        <h1 className="text-2xl md:text-3xl text-[#404041] font-semibold mb-4">
          Artikel tidak ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, artikel yang Anda cari tidak tersedia atau mungkin telah dihapus.
        </p>
        <Link href="/blog" className="inline-block px-6 py-2 bg-[#50806B] text-white rounded-lg font-medium hover:bg-opacity-90 transition">
          Kembali ke Blog
        </Link>
      </div>
    );
  }
};

export default BlogDetail;