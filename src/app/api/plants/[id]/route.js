// app/api/plants/[id]/route.js
import connectToDatabase from '@/lib/mongodb';
import Plant from '@/models/Plant';
import { NextResponse } from 'next/server';

// GET - Mendapatkan tanaman berdasarkan ID
export async function GET(request, { params }) {
  console.log("GET /api/plants/[id] - Request diterima, ID:", params.id);
  try {
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi database berhasil, mencari tanaman dengan ID:", params.id);
    
    const plant = await Plant.findById(params.id);
    console.log("Hasil pencarian tanaman:", plant ? "Ditemukan" : "Tidak ditemukan");
    
    if (!plant) {
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(plant);
  } catch (error) {
    console.error("Error saat mengambil tanaman:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Memperbarui tanaman
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Konversi harga dari string ke number jika diperlukan
    if (typeof data.price === 'string') {
      data.price = parseFloat(data.price.replace(/\./g, ""));
    }
    
    // Konversi stok dari string ke number jika diperlukan
    if (typeof data.stock === 'string') {
      data.stock = parseInt(data.stock);
    }
    
    // Jika stok 0, ubah status menjadi Out of Stock
    if (data.stock === 0) {
      data.status = 'Out of Stock';
    }
    
    const plant = await Plant.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!plant) {
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(plant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Menghapus tanaman
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const plant = await Plant.findByIdAndDelete(params.id);
    
    if (!plant) {
      return NextResponse.json({ error: 'Tanaman tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Tanaman berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}