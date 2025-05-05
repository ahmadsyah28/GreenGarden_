// app/api/desains/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DesainTaman from '@/models/Desain';

export async function GET(request, { params }) {
  const { id } = await params;
  console.log("GET /api/desains/[id] - Request diterima, ID:", id);
  try {
    console.log("Menghubungkan ke database...");
    await dbConnect();
    console.log("Koneksi database berhasil, mencari desain dengan ID:", id);
    
    const desain = await DesainTaman.findById(id);
    console.log("Hasil pencarian desain:", desain ? "Ditemukan" : "Tidak ditemukan");
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(desain);
  } catch (error) {
    console.error("Error saat mengambil desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    console.log("PUT /api/desains/[id] - Data yang diterima:", data);
    
    await dbConnect();
    
    // Validate status
    if (data.status && data.status !== 'Available' && data.status !== 'Not Available') {
      data.status = 'Available';
    }
    
    // Update timestamps
    data.updatedAt = new Date();
    
    const desain = await DesainTaman.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    console.log("Desain berhasil diupdate:", desain);
    return NextResponse.json(desain, { status: 200 });
  } catch (error) {
    console.error("Error saat update desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const desain = await DesainTaman.findByIdAndDelete(id);
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Desain berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("Error saat hapus desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
}
}
