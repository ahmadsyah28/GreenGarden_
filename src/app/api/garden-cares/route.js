// app/api/gardencares/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // Pastikan path ini benar
import GardenCare from "@/models/GardenCare";

export async function GET() {
  try {
    await dbConnect();
    const gardenCares = await GardenCare.find({}).sort({ id: 1 });
    return NextResponse.json(gardenCares, { status: 200 });
  } catch (error) {
    console.error("Error saat mengambil paket perawatan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Data yang diterima:", data);

    await dbConnect();

    // Generate new package ID
    const lastPackage = await GardenCare.findOne().sort({ id: -1 });
    const newId = lastPackage ? lastPackage.id + 1 : 1;

    const newGardenCare = {
      ...data,
      id: newId,
    };

    const gardenCare = await GardenCare.create(newGardenCare);
    console.log("Paket perawatan berhasil dibuat:", gardenCare.id);
    return NextResponse.json(gardenCare, { status: 201 });
  } catch (error) {
    console.error("Error saat membuat paket perawatan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await dbConnect();

    const deletedGardenCare = await GardenCare.findOneAndDelete({ id });
    if (!deletedGardenCare) {
      return NextResponse.json(
        { error: "Paket perawatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Paket perawatan berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saat menghapus paket perawatan:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}