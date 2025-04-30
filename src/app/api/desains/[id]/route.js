// app/api/desains/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DesainTaman from '@/models/DesainTaman';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    const desain = await DesainTaman.findById(id);
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(desain, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    await dbConnect();
    
    // Validate status
    if (data.status && data.status !== 'Available' && data.status !== 'Not Available') {
      data.status = 'Available';
    }
    
    // Update timestamps
    data.updatedAt = new Date();
    
    const desain = await DesainTaman.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json(desain, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    const desain = await DesainTaman.findByIdAndDelete(id);
    
    if (!desain) {
      return NextResponse.json({ error: 'Desain tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Desain berhasil dihapus' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}