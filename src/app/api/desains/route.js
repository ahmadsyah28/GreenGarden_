import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DesainTaman from "@/models/DesainTaman";

export async function GET(request) {
  try {
    await dbConnect();

    const desains = await DesainTaman.find({}).sort({ createdAt: -1 });
    return NextResponse.json(desains, { status: 200 });
  } catch (error) {
    console.error("Error saat mengambil desain:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();
    console.log("Data yang diterima:", data);

    // Validasi status
    const validStatus = ["Available", "Not Available"];
    if (!validStatus.includes(data.status)) {
      console.log(`Status tidak valid: ${data.status}, mengubah ke default`);
      data.status = "Available";
    }

    // Set timestamps
    const timestamp = new Date();
    data.createdAt = timestamp;
    data.updatedAt = timestamp;

    console.log("Data yang akan disimpan:", {
      name: data.name,
      category: data.category,
      price: data.price,
      status: data.status,
    });

    const desain = await DesainTaman.create(data);
    console.log("Desain berhasil dibuat:", desain._id);
    return NextResponse.json(desain, { status: 201 });
  } catch (error) {
    console.error("Error saat membuat desain:", error);
    if (error.errors) {
      for (const field in error.errors) {
        console.error(`Validasi gagal pada field ${field}:`, error.errors[field].message);
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}