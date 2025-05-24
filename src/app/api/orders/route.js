// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Plant from '@/models/Plant';

// Handler untuk GET: Mengambil pesanan berdasarkan userId dan status (opsional)
export async function GET(request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  try {
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const query = { userId };
    if (status) {
      query.status = status.toLowerCase();
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    console.log(`Fetched ${orders.length} orders for user ${userId}${status ? ` with status ${status}` : ''}`);
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders: ' + error.message }, { status: 500 });
  }
}

// Handler untuk POST: Membuat pesanan baru
export async function POST(request) {
  await connectMongo();

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const {
    userId,
    shippingInfo,
    shippingMethod,
    paymentMethod,
    voucherDiscount,
  } = body;

  // Validasi input
  if (!userId || !shippingInfo || !shippingMethod || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  if (!['regular', 'express'].includes(shippingMethod)) {
    return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 });
  }

  if (!['transfer', 'ewallet', 'cod'].includes(paymentMethod)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }

  if (voucherDiscount && (typeof voucherDiscount !== 'number' || voucherDiscount < 0)) {
    return NextResponse.json({ error: 'Invalid voucher discount' }, { status: 400 });
  }

  try {
    // Ambil data keranjang
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validasi stok
    for (const item of cart.items) {
      const plant = await Plant.findById(item.plantId);
      if (!plant) {
        return NextResponse.json({ error: `Plant ${item.nama} not found` }, { status: 404 });
      }
      if (plant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.nama}` }, { status: 400 });
      }
    }

    // Validasi shippingInfo
    const requiredShippingFields = ['nama', 'email', 'nomorTelepon', 'alamat', 'kota', 'kodePos'];
    for (const field of requiredShippingFields) {
      if (!shippingInfo[field]) {
        return NextResponse.json({ error: `Missing shippingInfo.${field}` }, { status: 400 });
      }
    }

    // Hitung biaya
    const subtotal = cart.items.reduce((total, item) => total + item.harga * item.quantity, 0);
    const shippingCost = shippingMethod === 'regular' ? 20000 : 45000;
    const total = subtotal - (voucherDiscount || 0) + shippingCost;

    if (total < 0) {
      return NextResponse.json({ error: 'Total cannot be negative' }, { status: 400 });
    }

    // Buat pesanan
    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        plantId: item.plantId,
        nama: item.nama,
        harga: item.harga,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingInfo,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      voucherDiscount: voucherDiscount || 0,
      total,
      status: 'selesai', // Status awal selalu selesai
      cancellationReason: '', // Default kosong
    });

    // Simpan pesanan
    await order.save();

    // Kurangi stok tanaman
    for (const item of cart.items) {
      await Plant.findByIdAndUpdate(item.plantId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Kosongkan keranjang
    await Cart.deleteOne({ userId });

    console.log(`Order created for user ${userId}:`, order._id);
    return NextResponse.json({ message: 'Order created successfully', orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order: ' + error.message }, { status: 500 });
  }
}