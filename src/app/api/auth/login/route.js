// api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  await connectMongo();

  const { email, password } = await request.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Email atau kata sandi salah' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Email atau kata sandi salah' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token, // Tambahkan token di sini
    }, { status: 200 });
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json({ error: 'Gagal login: ' + error.message }, { status: 500 });
  }
}