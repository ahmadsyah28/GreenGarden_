import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log('Token diterima:', token); // Log untuk debugging
    
    if (!token) {
      console.log('Tidak ada cookie auth_token');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verify(token, process.env.JWT_SECRET);
    console.log('Token terdekode:', decoded); // Log untuk debugging
    
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.log('ID pengguna tidak valid:', decoded.id);
      return NextResponse.json({ message: 'ID pengguna tidak valid' }, { status: 400 });
    }
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('Pengguna tidak ditemukan untuk ID:', decoded.id);
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }
    
    console.log('Pengguna ditemukan:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Kesalahan pemeriksaan autentikasi:', error.message);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}