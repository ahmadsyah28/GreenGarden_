// src/app/api/admin/orders/route.js (path baru untuk admin)
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

const isDev = process.env.NODE_ENV === "development";

export async function GET(request) {
  await connectMongo();
  
  try {
    // Fetch semua orders dengan populate user data
    const orders = await Order.find({})
      .populate({
        path: 'userId',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform data untuk frontend admin
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      user_id: order.userId, // Map userId ke user_id untuk kompatibilitas frontend
      items: order.items.map(item => ({
        _id: item._id,
        item_id: {
          name: item.nama, // Map nama ke name untuk kompatibilitas
          title: item.nama
        },
        item_type: item.type,
        quantity: item.quantity,
        price: item.harga,
        subtotal: item.harga * item.quantity
      })),
      address: `${order.shippingInfo.alamat}, ${order.shippingInfo.kota}, ${order.shippingInfo.kodePos}`,
      total_price: order.total, // Map total ke total_price
      status: order.status,
      payment_method: order.paymentMethod,
      shipping_method: order.shippingMethod,
      shipping_cost: order.shippingCost,
      subtotal: order.subtotal,
      voucher_discount: order.voucherDiscount,
      bookings: [], // Array kosong untuk bookings karena tidak ada di schema saat ini
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      // Tambahan info untuk admin
      shippingInfo: order.shippingInfo,
      cancellationReason: order.cancellationReason
    }));

    if (isDev) console.log(`Admin: Fetched ${transformedOrders.length} orders`);
    return NextResponse.json(transformedOrders, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error("Admin: Error fetching all orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectMongo();
  
  try {
    const body = await request.json();
    const { orderId, status, adminId } = body;

    // Validasi input
    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Status yang valid sesuai schema
    const validStatuses = ["pending", "processing", "shipped", "selesai", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Valid statuses: " + validStatuses.join(", ") },
        { status: 400 }
      );
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email phone'
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Transform response untuk konsistensi dengan frontend
    const transformedOrder = {
      _id: updatedOrder._id,
      user_id: updatedOrder.userId,
      items: updatedOrder.items.map(item => ({
        _id: item._id,
        item_id: {
          name: item.nama,
          title: item.nama
        },
        item_type: item.type,
        quantity: item.quantity,
        price: item.harga,
        subtotal: item.harga * item.quantity
      })),
      address: `${updatedOrder.shippingInfo.alamat}, ${updatedOrder.shippingInfo.kota}, ${updatedOrder.shippingInfo.kodePos}`,
      total_price: updatedOrder.total,
      status: updatedOrder.status,
      payment_method: updatedOrder.paymentMethod,
      shipping_method: updatedOrder.shippingMethod,
      shipping_cost: updatedOrder.shippingCost,
      subtotal: updatedOrder.subtotal,
      voucher_discount: updatedOrder.voucherDiscount,
      bookings: [],
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt
    };

    if (isDev) console.log(`Admin: Order ${orderId} status updated to ${status} by admin ${adminId}`);
    return NextResponse.json(transformedOrder, { status: 200 });
    
  } catch (error) {
    if (isDev) console.error("Admin: Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status: " + error.message },
      { status: 500 }
    );
  }
}