// utils/data.js
export const produkTanaman = [
  { 
    id: 1,
    src: '/images/tanaman/tanaman1.png', 
    nama: 'Marble Queen', 
    harga: 'Rp.20.000',
    deskripsi: 'Marble Queen adalah tanaman hias dengan daun berwarna hijau dan putih yang cantik. Tanaman ini mudah dirawat dan cocok untuk pemula.',
    perawatan: 'Siram 1-2 kali seminggu, letakkan di tempat yang tidak terkena sinar matahari langsung.',
    kebutuhan: 'Cahaya tidak langsung, air sedang'
  },
  { 
    id: 2,
    src: '/images/tanaman/tanaman2.png', 
    nama: 'Neon Pothos', 
    harga: 'Rp.30.000',
    deskripsi: 'Neon Pothos memiliki daun berwarna hijau cerah yang menyala. Tanaman ini sangat populer karena warnanya yang unik.',
    perawatan: 'Siram ketika tanah mulai kering, bisa ditempatkan di area dengan cahaya sedang.',
    kebutuhan: 'Cahaya sedang, air sedang'
  },
  { 
    id: 3,
    src: '/images/tanaman/tanaman3.png', 
    nama: 'Syngonium Rayii', 
    harga: 'Rp.25.000',
    deskripsi: 'Syngonium Rayii memiliki daun berbentuk hati dengan pola unik. Tanaman ini tumbuh dengan cepat dan cantik untuk dekorasi dalam ruangan.',
    perawatan: 'Jaga kelembaban tanah, hindari sinar matahari langsung.',
    kebutuhan: 'Cahaya tidak langsung, kelembaban tinggi'
  },
  { 
    id: 4,
    src: '/images/tanaman/tanaman4.png', 
    nama: 'Pineapple', 
    harga: 'Rp.20.000',
    deskripsi: 'Tanaman nanas hias ini memiliki daun yang menarik dan buah mini di bagian atas. Menambah kesan tropis untuk ruangan Anda.',
    perawatan: 'Siram secukupnya dan letakkan di tempat yang cukup mendapat cahaya matahari.',
    kebutuhan: 'Cahaya terang, air sedang'
  },
  { 
    id: 5,
    src: '/images/tanaman/tanaman5.png', 
    nama: 'African Milk Tree', 
    harga: 'Rp.20.000',
    deskripsi: 'African Milk Tree adalah tanaman kaktus yang berbentuk unik dan mudah tumbuh. Cocok untuk dekorasi interior minimalis.',
    perawatan: 'Siram hanya ketika tanah benar-benar kering, butuh banyak sinar matahari.',
    kebutuhan: 'Cahaya tinggi, air rendah'
  },
  { 
    id: 6,
    src: '/images/tanaman/tanaman6.png', 
    nama: 'Pothos', 
    harga: 'Rp.40.000',
    deskripsi: 'Pothos adalah tanaman merambat yang sangat mudah dirawat. Daun hijaunya akan menyegarkan suasana ruangan Anda.',
    perawatan: 'Siram seminggu sekali, bisa hidup dengan cahaya minimal.',
    kebutuhan: 'Cahaya rendah hingga sedang, air sedang'
  },
  { 
    id: 7,
    src: '/images/tanaman/tanaman7.png', 
    nama: 'Chinese Evergreen', 
    harga: 'Rp.75.000',
    deskripsi: 'Chinese Evergreen memiliki daun dengan pola menarik. Tanaman ini dikenal dapat membersihkan udara di dalam ruangan.',
    perawatan: 'Jaga kelembaban tanah dan letakkan di tempat teduh.',
    kebutuhan: 'Cahaya rendah, air sedang'
  },
  { 
    id: 8,
    src: '/images/tanaman/tanaman8.png', 
    nama: 'Aglonema Red', 
    harga: 'Rp.45.000',
    deskripsi: 'Aglonema Red memiliki daun dengan warna merah yang mencolok. Tanaman ini menjadi favorit untuk dekorasi ruangan.',
    perawatan: 'Siram ketika tanah mulai kering, hindari sinar matahari langsung.',
    kebutuhan: 'Cahaya tidak langsung, kelembaban sedang'
  },
];

export const categories = [
  { name: "Indoor Plants", items: ["Alocasia", "Hoya", "Sansevieria", "Syngonium"] },
  { name: "Outdoor Plants", items: [] },
  { name: "Sun Requirements", items: [] },
];

export const sortOptions = ["Popular", "Termurah", "Termahal"];

// Data untuk Desain Taman
export const desainTamanData = [
  {
    id: 1,
    name: "Taman Minimalis Modern",
    price: 1500000,
    image: "/images/desain/desain1.png",
    description: "Desain taman minimalis dengan elemen modern yang cocok untuk rumah kontemporer. Menggunakan tanaman yang mudah perawatan dan penataan rapi.",
    features: [
      "Layout desain taman sesuai kebutuhan",
      "Rekomendasi tanaman sesuai konsep",
      "Rencana peletakan furniture taman",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 20, // meter persegi
    maxArea: 100, // meter persegi
    suitableFor: "Rumah Tipe 36-45",
    mainPlants: ["Monstera", "Aglaonema", "Calathea", "Sanseviera"],
    estimatedTimeToFinish: "2-4 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 5000000 },
      { name: "Perawatan 3 bulan", price: 1200000 },
    ]
  },
  {
    id: 2,
    name: "Taman Tropis Bali",
    price: 2000000,
    image: "/images/desain/desain2.png",
    description: "Desain taman dengan nuansa tropis khas Bali, menciptakan suasana resort di rumah Anda. Kombinasi tanaman tropis dan elemen air untuk kesan menyegarkan.",
    features: [
      "Layout desain taman dengan elemen air",
      "Rekomendasi tanaman tropis",
      "Desain gazebo atau saung",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 50, // meter persegi
    maxArea: 200, // meter persegi
    suitableFor: "Rumah dengan halaman luas",
    mainPlants: ["Pisang Hias", "Heliconia", "Palem", "Anggrek"],
    estimatedTimeToFinish: "1-2 bulan",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 8000000 },
      { name: "Perawatan 3 bulan", price: 1500000 },
    ]
  },
  {
    id: 3,
    name: "Taman Kering Zen",
    price: 1800000,
    image: "/images/desain/desain3.png",
    description: "Desain taman kering terinspirasi dari kebun Zen Jepang. Menggunakan batu, kerikil, dan tanaman minimal untuk menciptakan ketenangan dan harmoni.",
    features: [
      "Layout desain taman zen",
      "Rekomendasi material batu dan kerikil",
      "Peletakan elemen zen",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 15, // meter persegi
    maxArea: 80, // meter persegi
    suitableFor: "Area meditasi, Sudut taman",
    mainPlants: ["Bambu Jepang", "Maple", "Pinus", "Sukulen"],
    estimatedTimeToFinish: "2-3 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 4500000 },
      { name: "Perawatan 3 bulan", price: 900000 },
    ]
  },
  {
    id: 4,
    name: "Taman Produktif",
    price: 1200000,
    image: "/images/desain/desain4.png",
    description: "Desain taman yang menggabungkan estetika dan fungsi dengan area untuk menanam sayur, buah, dan rempah. Ideal untuk keluarga yang ingin berkebun.",
    features: [
      "Layout desain taman produktif",
      "Rekomendasi tanaman produktif",
      "Sistem irigasi sederhana",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 30, // meter persegi
    maxArea: 150, // meter persegi
    suitableFor: "Keluarga yang suka berkebun",
    mainPlants: ["Tomat", "Cabai", "Rosemary", "Kangkung"],
    estimatedTimeToFinish: "3-5 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 5500000 },
      { name: "Perawatan 3 bulan", price: 1000000 },
    ]
  },
  {
    id: 5,
    name: "Taman Vertikal",
    price: 1300000,
    image: "/images/desain/desain5.png",
    description: "Desain taman vertikal yang memanfaatkan ruang terbatas dengan maksimal. Cocok untuk rumah di perkotaan dengan lahan terbatas.",
    features: [
      "Layout desain taman vertikal",
      "Rekomendasi tanaman untuk dinding hijau",
      "Sistem pengairan otomatis",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 5, // meter persegi
    maxArea: 30, // meter persegi
    suitableFor: "Apartemen, Rumah dengan lahan terbatas",
    mainPlants: ["Pakis", "Spider Plant", "Philodendron", "Sirih Gading"],
    estimatedTimeToFinish: "1-3 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 3500000 },
      { name: "Perawatan 3 bulan", price: 800000 },
    ]
  },
  {
    id: 6,
    name: "Taman Keluarga",
    price: 2500000,
    image: "/images/desain/desain6.png",
    description: "Desain taman ramah keluarga dengan area bermain anak, tempat bersantai, dan spot berkumpul. Kombinasi fungsionalitas dan keindahan.",
    features: [
      "Layout desain taman keluarga",
      "Area bermain anak yang aman",
      "Gazebo atau area bersantai",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 80, // meter persegi
    maxArea: 300, // meter persegi
    suitableFor: "Keluarga dengan anak",
    mainPlants: ["Rumput Jepang", "Kamboja", "Pucuk Merah", "Bougenville"],
    estimatedTimeToFinish: "1-2 bulan",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 10000000 },
      { name: "Perawatan 3 bulan", price: 2000000 },
    ]
  },
  {
    id: 7,
    name: "Taman Mediterania",
    price: 2200000,
    image: "/images/desain/desain7.jpg",
    description: "Desain taman bergaya Mediterania dengan tanaman drought-resistant dan elemen batu. Menciptakan nuansa Eropa Selatan yang hangat.",
    features: [
      "Layout desain taman Mediterania",
      "Rekomendasi tanaman tahan kering",
      "Elemen air dan batu",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 40, // meter persegi
    maxArea: 200, // meter persegi
    suitableFor: "Rumah dengan pencahayaan matahari penuh",
    mainPlants: ["Lavender", "Zaitun", "Rosemary", "Sukulen"],
    estimatedTimeToFinish: "3-6 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 7500000 },
      { name: "Perawatan 3 bulan", price: 1500000 },
    ]
  },
  {
    id: 8,
    name: "Taman Cottage",
    price: 1700000,
    image: "/images/desain/desain8.jpg",
    description: "Desain taman gaya cottage dengan bunga-bunga yang berwarna-warni dan jalur setapak yang romantis. Menciptakan suasana pedesaan Inggris yang klasik.",
    features: [
      "Layout desain taman cottage",
      "Rekomendasi tanaman berbunga",
      "Jalur setapak dan pagar tanaman",
      "Estimasi biaya material dan tanaman",
    ],
    minArea: 30, // meter persegi
    maxArea: 150, // meter persegi
    suitableFor: "Rumah bergaya klasik atau vintage",
    mainPlants: ["Mawar", "Lavender", "Hydrangea", "Daisy"],
    estimatedTimeToFinish: "2-5 minggu",
    additionalServices: [
      { name: "Konsultasi on-site", price: 300000 },
      { name: "Implementasi desain", price: 6000000 },
      { name: "Perawatan 3 bulan", price: 1300000 },
    ]
  }
];

export const desainCategories = [
  { name: "Gaya Taman", items: ["Minimalis", "Tropis", "Zen", "Mediterania", "Cottage"] },
  { name: "Ukuran Taman", items: ["Kecil (<30m²)", "Sedang (30-100m²)", "Besar (>100m²)"] },
  { name: "Jenis Taman", items: ["Produktif", "Hias", "Vertikal", "Keluarga"] },
];