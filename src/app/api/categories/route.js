// app/api/categories/route.js
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

// GET - Mendapatkan semua kategori
export async function GET(request) {
  console.log("GET /api/categories - Memulai request");
  try {
    // Cek apakah ada parameter type
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi berhasil, mengambil kategori...");
    
    // Filter berdasarkan tipe jika parameter type ada
    const query = type ? { type } : {};
    console.log("Query filter:", query);
    
    const categories = await Category.find(query).sort({ name: 1 });
    console.log("Kategori berhasil diambil:", categories);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error saat mengambil kategori:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Menambahkan kategori baru
export async function POST(request) {
  console.log("POST /api/categories - Memulai request");
  try {
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi berhasil, membaca body request...");
    const data = await request.json();
    console.log("Data kategori baru:", data);
    
    // Validasi data
    if (!data.name || data.name.trim() === '') {
      console.error("Nama kategori kosong");
      return NextResponse.json({ error: "Nama kategori harus diisi" }, { status: 400 });
    }
    
    // Pastikan tipe kategori valid
    if (data.type !== 'Tanaman' && data.type !== 'DesainTaman') {
      console.error(`Tipe kategori tidak valid: ${data.type}`);
      return NextResponse.json({ error: "Tipe kategori harus 'Tanaman' atau 'DesainTaman'" }, { status: 400 });
    }
    
    // Cek apakah kategori dengan nama dan tipe yang sama sudah ada
    const existingCategory = await Category.findOne({
      name: data.name,
      type: data.type
    });
    
    if (existingCategory) {
      console.error(`Kategori ${data.name} dengan tipe ${data.type} sudah ada`);
      return NextResponse.json({ error: "Kategori dengan nama dan tipe ini sudah ada" }, { status: 400 });
    }
    
    console.log("Mencoba membuat kategori baru");
    const category = await Category.create(data);
    console.log("Kategori berhasil dibuat:", category);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error saat membuat kategori:", error);
    // Cek apakah error duplikasi
    if (error.code === 11000) {
      return NextResponse.json({ error: "Kategori dengan nama ini sudah ada" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}