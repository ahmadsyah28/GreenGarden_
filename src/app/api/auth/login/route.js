// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { email, password } = await req.json();
    
    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }
    
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }
    
    // Verifikasi password
    const passwordMatch = await compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }
    
    // Buat token JWT
    const token = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    
    // Buat response
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
    // Set cookie pada response
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1800, // 30 menit
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}