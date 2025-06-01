# 🌿 GreenGarden\_

**GreenGarden\_** adalah aplikasi web berbasis **Next.js** yang membantu pengguna,mulai dari pecinta tanaman hias hingga pengelola lanskap profesional mengelola kebun mereka secara efisien. Aplikasi ini menyediakan fitur pengelolaan tanaman, layanan perawatan, dan jasa desain taman dalam satu platform terpadu.

## 🚀 Fitur Umum

* **Blog Edukatif** – Berisi artikel seputar tanaman, perawatan taman, dan inspirasi desain lanskap.
* **Tanaman Hias** – Menyediakan berbagai jenis tanaman hias yang bisa dibeli langsung oleh pengguna.
* **Layanan Perawatan Taman** – Pengguna dapat memilih jasa untuk merawat taman/tanaman mereka.
* **Jasa Desain Taman** – Menyediakan layanan desain taman berdasarkan preferensi pengguna dan luas taman yang dimiliki.
* **Keranjang & Checkout** – Fitur belanja terintegrasi untuk memesan barang dan jasa.
* **Pembayaran** – Sistem pembayaran online untuk memproses transaksi.

## 👥 Peran Pengguna & Fitur Spesifik

### Admin

| Kategori          | Fitur                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Konten**        | • Kelola Blog (CRUD artikel seputar tanaman & taman)<br>• Dashboard analitik kunjungan & penjualan                                      |
| **Pengguna**      | • Kelola data user (CRUD, peran, status akun)                                                                                           |
| **Pesanan**       | • Lihat & proses order customer (status, pembayaran, pengiriman)                                                                        |
| **Produk & Jasa** | • Kelola katalog Tanaman Hias<br>• Kelola layanan Perawatan Taman<br>• Kelola jasa Desain Taman (termasuk harga berjenjang sesuai luas) |

### Customer

| Kategori      | Fitur                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Edukasi**   | • Akses Blog berisi artikel tentang tumbuhan, teknik berkebun, desain lanskap                                                                 |
| **Belanja**   | • Jelajahi katalog Tanaman Hias & tambah ke Keranjang                                                                                         |
| **Layanan**   | • Pilih Paket Perawatan Taman (sesuai jenis & jumlah tanaman)<br>• Pesan Jasa Desain Taman (input luas taman, preferensi gaya)                |
| **Transaksi** | • Keranjang terintegrasi (barang & jasa)<br>• Checkout dengan verifikasi stok & jadwal layanan<br>• Pembayaran online melalui payment gateway |
| **Riwayat**   | • Lihat status pesanan & riwayat transaksi                                                                                                    |

## 🛠️ Teknologi Digunakan

* **Next.js** – Framework React yang mendukung SSG & SSR.
* **React** – Library UI berbasis komponen.
* **Tailwind CSS** – Utilitas CSS untuk styling cepat & konsisten.
* **Node.js** & **Express** (opsional) – API backend & integrasi database.
* **Vercel** – Platform deployment serverless.

## 📦 Instalasi & Menjalankan Lokal

```bash
# 1. Clone repositori
$ git clone https://github.com/ahmadsyah28/GreenGarden_.git
$ cd GreenGarden_

# 2. Instal dependensi
$ npm install # atau yarn install

# 3. Jalankan server development
$ npm run dev # atau yarn dev

# 4. Buka di browser
# http://localhost:3000
```

## 🌐 Deployment ke Vercel

1. Push kode ke GitHub.
2. Login ke [Vercel](https://vercel.com/) dan pilih **New Project**.
3. Hubungkan repositori GreenGarden\_.
4. Gunakan setting build default (`npm run build`).
5. Klik **Deploy**—Vercel akan memberi URL production.

## 🤝 Kontribusi

Kontribusi terbuka untuk siapa saja.

1. **Fork** repositori ini.
2. Buat branch fitur: `git checkout -b fitur-baru`.
3. Commit perubahan: `git commit -m "Menambahkan fitur ___"`
4. Push ke branch: `git push origin fitur-baru`
5. Buat **Pull Request**.

## 📄 Lisensi

Repositori ini berada di bawah lisensi **MIT**. Lihat file [LICENSE](LICENSE) untuk detailnya.

## 👨‍💻 Pengembang

* **Ahmad Syah Ramadhan** – [@ahmadsyah28](https://github.com/ahmadsyah28)
* **Muhammad Bintang Indra Hidayat** – [@MuhammadBintang27](https://github.com/MuhammadBintang27)
