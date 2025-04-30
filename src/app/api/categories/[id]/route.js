// app/api/categories/[id]/route.js
import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

// GET - Mendapatkan kategori berdasarkan ID
export async function GET(request, { params }) {
  console.log(`GET /api/categories/${params.id} - Memulai request`);
  try {
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi berhasil, mencari kategori...");
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      console.error(`Kategori dengan ID ${params.id} tidak ditemukan`);
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    
    console.log("Kategori berhasil ditemukan:", category);
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error saat mengambil kategori:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Memperbarui kategori
export async function PUT(request, { params }) {
  console.log(`PUT /api/categories/${params.id} - Memulai request`);
  try {
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi berhasil, membaca body request...");
    
    const data = await request.json();
    console.log("Data update kategori:", data);
    
    // Validasi data
    if (data.name !== undefined && data.name.trim() === '') {
      console.error("Nama kategori kosong");
      return NextResponse.json({ error: "Nama kategori tidak boleh kosong" }, { status: 400 });
    }
    
    // Cek apakah update akan menyebabkan duplikasi
    if (data.name || data.type) {
      const category = await Category.findById(params.id);
      if (!category) {
        console.error(`Kategori dengan ID ${params.id} tidak ditemukan`);
        return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
      }
      
      const existingCategory = await Category.findOne({
        name: data.name || category.name,
        type: data.type || category.type,
        _id: { $ne: params.id } // Kecualikan kategori yang sedang diupdate
      });
      
      if (existingCategory) {
        console.error("Duplikasi kategori ditemukan");
        return NextResponse.json({ error: "Kategori dengan nama dan tipe ini sudah ada" }, { status: 400 });
      }
    }
    
    console.log("Memperbarui kategori...");
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      console.error(`Kategori dengan ID ${params.id} tidak ditemukan`);
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    
    console.log("Kategori berhasil diperbarui:", updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error saat memperbarui kategori:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Menghapus kategori
export async function DELETE(request, { params }) {
  console.log(`DELETE /api/categories/${params.id} - Memulai request`);
  try {
    console.log("Menghubungkan ke database...");
    await connectToDatabase();
    console.log("Koneksi berhasil, mencari dan menghapus kategori...");
    
    const deletedCategory = await Category.findByIdAndDelete(params.id);
    
    if (!deletedCategory) {
      console.error(`Kategori dengan ID ${params.id} tidak ditemukan`);
      return NextResponse.json({ error: "Kategori tidak ditemukan" }, { status: 404 });
    }
    
    console.log("Kategori berhasil dihapus:", deletedCategory);
    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus kategori:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}