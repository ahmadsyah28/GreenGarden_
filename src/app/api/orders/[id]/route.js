// src/app/api/orders/[id]/route.js (Fixed with await params)
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/lib/mongodb";
import Order from "@/models/Order";

const isDev = process.env.NODE_ENV === "development";

export async function GET(request, { params }) {
  await connectMongo();
  
  try {
    // Await params before using
    const { id } = await params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
    }

    const order = await Order.findById(id).lean();
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (isDev) console.log(`Fetched order ${id}`);
    return NextResponse.json({ order }, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order: " + error.message },
      { status: 500 }
    );
  }
}