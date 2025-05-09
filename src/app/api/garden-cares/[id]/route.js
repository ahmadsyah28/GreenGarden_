// app/api/gardencares/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import GardenCare from "@/models/GardenCare";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const gardenCare = await GardenCare.findOne({ id: parseInt(params.id) });
    if (!gardenCare) {
      return NextResponse.json(
        { error: "Paket perawatan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(gardenCare, { status: 200 });
  } catch (error) {
    console.error("Error saat mengambil paket perawatan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    await dbConnect();

    const updatedGardenCare = await GardenCare.findOneAndUpdate(
      { id: parseInt(params.id) },
      { $set: data },
      { new: true }
    );

    if (!updatedGardenCare) {
      return NextResponse.json(
        { error: "Paket perawatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGardenCare, { status: 200 });
  } catch (error) {
    console.error("Error saat memperbarui paket perawatan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}