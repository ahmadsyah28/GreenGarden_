import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Plant from '@/models/Plant';

// GET - Mendapatkan tanaman berdasarkan ID
export async function GET(request, context) {
  const params = await context.params; // Menunggu params diresolusi
  console.log("GET /api/plants/[id] - Request diterima, ID:", params.id);

  try {
    console.log("Menghubungkan ke database...");
    await connectMongo();
    console.log("Koneksi database berhasil, mencari tanaman dengan ID:", params.id);

    const plant = await Plant.findById(params.id);
    console.log("Hasil pencarian tanaman:", plant ? "Ditemukan" : "Tidak ditemukan");

    if (!plant) {
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(plant, { status: 200 });
  } catch (error) {
    console.error("Error saat mengambil tanaman:", error);
    return NextResponse.json({ error: 'Gagal mengambil tanaman' }, { status: 500 });
  }
}

// PUT - Memperbarui tanaman
export async function PUT(request, context) {
  const params = await context.params; // Menunggu params diresolusi
  console.log("PUT /api/plants/[id] - Request diterima, ID:", params.id);

  try {
    await connectMongo();
    const data = await request.json();
    console.log("Data yang diterima untuk pembaruan:", data);

    // Validasi field wajib sesuai skema
    if (!data.name || !data.category || !data.price || !data.description) {
      return NextResponse.json(
        { error: 'Nama, kategori, harga, dan deskripsi wajib diisi' },
        { status: 400 }
      );
    }

    // Konversi harga dari string ke number jika diperlukan
    if (typeof data.price === 'string') {
      data.price = parseFloat(data.price.replace(/\./g, ""));
      if (isNaN(data.price)) {
        return NextResponse.json({ error: 'Harga tidak valid' }, { status: 400 });
      }
    }

    // Konversi stok dari string ke number jika diperlukan
    if (typeof data.stock === 'string') {
      data.stock = parseInt(data.stock);
      if (isNaN(data.stock)) {
        return NextResponse.json({ error: 'Stok tidak valid' }, { status: 400 });
      }
    }

    // Pastikan stok tidak negatif
    if (data.stock < 0) {
      return NextResponse.json({ error: 'Stok tidak boleh negatif' }, { status: 400 });
    }

    // Jika stok 0, ubah status menjadi Out of Stock
    if (data.stock === 0) {
      data.status = 'Out of Stock';
    } else {
      data.status = 'In Stock';
    }

    // Validasi status jika disediakan
    if (data.status && !['In Stock', 'Out of Stock'].includes(data.status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    const plant = await Plant.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!plant) {
      console.log("Tanaman tidak ditemukan untuk ID:", params.id);
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }

    console.log("Tanaman berhasil diperbarui:", plant);
    return NextResponse.json(plant, { status: 200 });
  } catch (error) {
    console.error("Error saat memperbarui tanaman:", error);
    return NextResponse.json({ error: error.message || 'Gagal memperbarui tanaman' }, { status: 400 });
  }
}

// DELETE - Menghapus tanaman
export async function DELETE(request, context) {
  const params = await context.params; // Menunggu params diresolusi
  console.log("DELETE /api/plants/[id] - Request diterima, ID:", params.id);

  try {
    await connectMongo();
    const plant = await Plant.findByIdAndDelete(params.id);

    if (!plant) {
      console.log("Tanaman tidak ditemukan untuk ID:", params.id);
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }

    console.log("Tanaman berhasil dihapus untuk ID:", params.id);
    return NextResponse.json({ message: 'Tanaman berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("Error saat menghapus tanaman:", error);
    return NextResponse.json({ error: 'Gagal menghapus tanaman' }, { status: 500 });
  }
}