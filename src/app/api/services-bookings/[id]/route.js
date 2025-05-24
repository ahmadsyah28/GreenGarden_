import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ServiceBooking from "@/models/ServiceBooking";

export async function PUT(request, { params }) {
  try {
    const { status, adminId } = await request.json();
    const bookingId = params.id;

    await dbConnect();

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    booking.status = status;
    booking.confirmed_by = adminId || booking.confirmed_by;
    booking.updated_at = new Date();
    await booking.save();

    return NextResponse.json(
      { message: "Status booking layanan berhasil diperbarui", booking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saat memperbarui status booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}