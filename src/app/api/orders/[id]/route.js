// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  await connectMongo();
  const { id } = params;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log(`Fetched order ${id}`);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order: ' + error.message }, { status: 500 });
  }
}