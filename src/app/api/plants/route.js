// app/api/plants/route.js
import connectToDatabase from '@/lib/mongodb';
import Plant from '@/models/Plant';
import { NextResponse } from 'next/server';

// GET - Mendapatkan semua tanaman
export async function GET() {
  try {
    await connectToDatabase();
    const plants = await Plant.find({}).sort({ createdAt: -1 });
    return NextResponse.json(plants);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Menambahkan tanaman baru
export async function POST(request) {
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
    
    const plant = await Plant.create(data);
    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}