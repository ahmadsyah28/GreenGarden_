import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DesainTaman from '@/models/DesainTaman';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = params; // Tidak perlu await
  console.log("GET /api/desains/[id] - Request diterima, ID:", id);

  if (!id || !ObjectId.isValid(id)) {
    console.log("ID tidak valid:", id);
    return NextResponse.json({ error: 'ID desain tidak valid' }, { status: 400 });
  }

  try {
    await dbConnect();
    const desain = await DesainTaman.findById(id);
    console.log("Hasil pencarian desain:", desain ? "Ditemukan" : "Tidak ditemukan");
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(desain, { status: 200 });
  } catch (error) {
    console.error("Error saat mengambil desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  console.log("PUT /api/desains/[id] - Request diterima, ID:", id);

  // Validasi ID
  if (!id || !ObjectId.isValid(id)) {
    console.log("ID tidak valid:", id);
    return NextResponse.json({ error: 'ID desain tidak valid' }, { status: 400 });
  }

  try {
    const data = await request.json();
    console.log("PUT /api/desains/[id] - Data yang diterima:", data);
    
    await dbConnect();
    
    // Validasi status
    if (data.status && !['Available', 'Not Available'].includes(data.status)) {
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
  const { id } = params;
  console.log("DELETE /api/desains/[id] - Request diterima, ID:", id);

  // Validasi ID
  if (!id || !ObjectId.isValid(id)) {
    console.log("ID tidak valid:", id);
    return NextResponse.json({ error: 'ID desain tidak valid' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    const desain = await DesainTaman.findByIdAndDelete(id);
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    console.log("Desain berhasil dihapus:", id);
    return NextResponse.json({ message: 'Desain berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error("Error saat hapus desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}