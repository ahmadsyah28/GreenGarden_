// app/api/services/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Handler untuk GET request
export async function GET(request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "taman_db");
  const collection = db.collection("perawatan");
  
  try {
    // Mengambil id dari URL jika ada
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Mengambil satu data perawatan berdasarkan ID
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "ID perawatan tidak valid" },
          { status: 400 }
        );
      }
      
      const perawatan = await collection.findOne({ _id: new ObjectId(id) });
      
      if (!perawatan) {
        return NextResponse.json(
          { success: false, message: "Data perawatan tidak ditemukan" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, data: perawatan });
    } else {
      // Mengambil semua data perawatan dengan sorting berdasarkan tanggal terbaru
      const perawatan = await collection
        .find({})
        .sort({ tanggalPerawatan: -1 })
        .toArray();
      
      return NextResponse.json({ success: true, data: perawatan });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk POST request
export async function POST(request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "taman_db");
  const collection = db.collection("perawatan");
  
  try {
    // Parsing body data
    const body = await request.json();
    
    // Validasi data yang diperlukan
    const { namaTaman, jenisPerawatan, tanggalPerawatan, biaya, petugasPenanggungJawab } = body;
    
    if (!namaTaman || !jenisPerawatan || !tanggalPerawatan || !biaya || !petugasPenanggungJawab) {
      return NextResponse.json(
        { success: false, message: "Semua field dengan tanda * wajib diisi" },
        { status: 400 }
      );
    }

    // Tambahkan timestamp untuk created_at dan updated_at
    const data = {
      ...body,
      biaya: Number(body.biaya),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Simpan data ke MongoDB
    const result = await collection.insertOne(data);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Data perawatan taman berhasil disimpan", 
        data: { 
          _id: result.insertedId,
          ...data 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk PUT request
export async function PUT(request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "taman_db");
  const collection = db.collection("perawatan");
  
  try {
    // Mengambil id dari URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID perawatan tidak valid" },
        { status: 400 }
      );
    }

    // Parsing body data
    const body = await request.json();
    
    // Validasi data yang diperlukan
    const { namaTaman, jenisPerawatan, tanggalPerawatan, biaya, petugasPenanggungJawab } = body;
    
    if (!namaTaman || !jenisPerawatan || !tanggalPerawatan || !biaya || !petugasPenanggungJawab) {
      return NextResponse.json(
        { success: false, message: "Semua field dengan tanda * wajib diisi" },
        { status: 400 }
      );
    }

    // Update data dengan timestamp baru
    const data = {
      ...body,
      biaya: Number(body.biaya),
      updated_at: new Date()
    };

    // Update data di MongoDB
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data perawatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Data perawatan taman berhasil diperbarui"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk DELETE request
export async function DELETE(request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "taman_db");
  const collection = db.collection("perawatan");
  
  try {
    // Mengambil id dari URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "ID perawatan tidak valid" },
        { status: 400 }
      );
    }

    // Hapus data dari MongoDB
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data perawatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Data perawatan taman berhasil dihapus" 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}