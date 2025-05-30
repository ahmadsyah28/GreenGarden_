import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

// Tandai rute sebagai dinamis
export const dynamic = 'force-dynamic';

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
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // PERBAIKAN: Tambahkan await di depan cookies()
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 jam
      path: '/',
    });

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json({ error: 'Gagal login: ' + error.message }, { status: 500 });
  }
}