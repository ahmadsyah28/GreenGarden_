// src/app/api/users/[id]/route.js (Fixed with await params)
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const isDev = process.env.NODE_ENV === "development";

export async function GET(request, { params }) {
  try {
    await connectMongo();
    
    // Await params before using
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
   
    const user = await User.findById(id).select('-password');
   
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (isDev) console.log(`Fetched user ${id}`);
    return NextResponse.json({ user }, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongo();
    
    // Await params before using
    const { id } = await params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const data = await request.json();
   
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
   
    // Handle password separately if it's being updated
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
   
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (isDev) console.log(`Updated user ${id}`);
    return NextResponse.json({
      message: 'User berhasil diperbarui',
      user: updatedUser
    }, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongo();
    
    // Await params before using
    const { id } = await params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
   
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
   
    // Delete user
    await User.findByIdAndDelete(id);

    if (isDev) console.log(`Deleted user ${id}`);
    return NextResponse.json({
      message: 'User berhasil dihapus'
    }, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user: ' + error.message },
      { status: 500 }
    );
  }
}