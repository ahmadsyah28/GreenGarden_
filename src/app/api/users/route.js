// app/api/users/route.js - Modified POST method to hash passwords
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('-password');
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    
    const user = await User.create(data);
    
    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;
    
    return NextResponse.json(
      { message: 'User berhasil dibuat', user: userObj },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}