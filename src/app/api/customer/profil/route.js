// app/api/customer/profile/route.js
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET route untuk mendapatkan profil customer
export async function GET() {
  try {
    await connectToDatabase();
    
    // Ambil token dari cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
    
    // Verifikasi token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Validasi ID format
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return NextResponse.json({ message: 'ID user tidak valid' }, { status: 400 });
    }
    
    // Cari user berdasarkan ID dalam token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
  }
}

// PUT route untuk update profil customer
export async function PUT(req) {
  try {
    await connectToDatabase();
    
    // Ambil token dari cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
    
    // Verifikasi token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Validasi ID format
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return NextResponse.json({ message: 'ID user tidak valid' }, { status: 400 });
    }
    
    // Parse data dari request body
    const data = await req.json();
    const { name, phone } = data;
    
    // Validasi input
    if (!name) {
      return NextResponse.json({ message: 'Nama tidak boleh kosong' }, { status: 400 });
    }
    
    // Update data user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone },
      { new: true } // Return the updated document
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan saat memperbarui profil' }, { status: 500 });
  }
}