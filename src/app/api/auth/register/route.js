// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { name, email, password, phone } = await req.json();
    
    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json({ 
        message: 'Nama, email, dan password harus diisi' 
      }, { status: 400 });
    }
    
    // Cek email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ 
        message: 'Email sudah terdaftar' 
      }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Buat user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'customer'
    });
    
    // Hapus password dari respons
    const userObj = user.toObject();
    delete userObj.password;
    
    return NextResponse.json({
      message: 'Pendaftaran berhasil',
      user: userObj
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      message: 'Terjadi kesalahan saat mendaftar' 
    }, { status: 500 });
  }
}