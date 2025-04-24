// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Ambil token dari cookie - gunakan await
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verifikasi token
    const decoded = verify(token, process.env.JWT_SECRET);
    
    // Validasi ID format
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    // Cari user berdasarkan ID dalam token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Tambahkan console.log untuk debugging
    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}