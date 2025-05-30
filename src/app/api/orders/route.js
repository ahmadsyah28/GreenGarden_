// src/app/api/orders/route.js (Customer orders)
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Plant from "@/models/Plant";
import DesainTaman from "@/models/DesainTaman";
import GardenCare from "@/models/GardenCare";

const isDev = process.env.NODE_ENV === "development";

export async function GET(request) {
  await connectMongo();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const query = { userId };
    if (status) {
      query.status = status.toLowerCase();
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    if (isDev)
      console.log(
        `Fetched ${orders.length} orders for user ${userId}${status ? ` with status ${status}` : ""}`
      );
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    if (isDev) console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectMongo();

  try {
    const body = await request.json();
    const {
      userId,
      items,
      shippingInfo,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      voucherDiscount,
      total,
    } = body;

    // Validate input
    if (
      !userId ||
      !items ||
      !Array.isArray(items) ||
      !shippingInfo ||
      !shippingMethod ||
      !shippingCost ||
      !paymentMethod ||
      !subtotal ||
      !total
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    if (!["regular", "express"].includes(shippingMethod)) {
      return NextResponse.json({ error: "Invalid shipping method" }, { status: 400 });
    }

    if (!["transfer", "ewallet", "cod"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    if (voucherDiscount && (typeof voucherDiscount !== "number" || voucherDiscount < 0)) {
      return NextResponse.json({ error: "Invalid voucher discount" }, { status: 400 });
    }

    if (typeof subtotal !== "number" || subtotal < 0) {
      return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 });
    }

    if (typeof total !== "number" || total < 0) {
      return NextResponse.json({ error: "Invalid total" }, { status: 400 });
    }

    // Validate shippingInfo
    const requiredShippingFields = [
      "nama",
      "email",
      "nomorTelepon",
      "alamat",
      "kota",
      "kodePos",
    ];
    for (const field of requiredShippingFields) {
      if (!shippingInfo[field]) {
        return NextResponse.json(
          { error: `Missing shippingInfo.${field}` },
          { status: 400 }
        );
      }
    }

    // Validate items
    if (items.length === 0) {
      return NextResponse.json({ error: "Cart items cannot be empty" }, { status: 400 });
    }

    for (const item of items) {
      if (
        !item.type ||
        !item.itemId ||
        !item.quantity ||
        !item.harga ||
        !item.nama ||
        (item.type === "maintenance" && !item.optionId)
      ) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
      }

      let Model;
      if (item.type === "plant") {
        Model = Plant;
      } else if (item.type === "design") {
        Model = DesainTaman;
      } else if (item.type === "maintenance") {
        Model = GardenCare;
      } else {
        return NextResponse.json(
          { error: "Invalid item type" },
          { status: 400 }
        );
      }

      const dbItem = await Model.findById(item.itemId);
      if (!dbItem) {
        return NextResponse.json(
          { error: `${item.type} not found: ${item.nama}` },
          { status: 404 }
        );
      }

      if (item.type === "plant" && dbItem.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.nama}` },
          { status: 400 }
        );
      }

      if (item.type === "plant" && dbItem.status === "Out of Stock") {
        return NextResponse.json(
          { error: `Plant out of stock: ${item.nama}` },
          { status: 400 }
        );
      }

      if (item.type === "design" && dbItem.status === "Not Available") {
        return NextResponse.json(
          { error: `Design not available: ${item.nama}` },
          { status: 400 }
        );
      }

      if (item.type === "maintenance" && dbItem.status === "Inactive") {
        return NextResponse.json(
          { error: `Maintenance service inactive: ${item.nama}` },
          { status: 400 }
        );
      }

      if (item.type === "maintenance") {
        const option = dbItem.options.find((opt) => opt.id === item.optionId);
        if (!option) {
          return NextResponse.json(
            { error: `Invalid maintenance option for ${item.nama}` },
            { status: 400 }
          );
        }
      }

      if (item.type === "design" && item.additionalServices) {
        if (!Array.isArray(item.additionalServices)) {
          return NextResponse.json(
            { error: "additionalServices must be an array" },
            { status: 400 }
          );
        }
        const validServices = dbItem.additionalServices.map((s) => s.name);
        const invalidServices = item.additionalServices.filter(
          (s) => !validServices.includes(s.name)
        );
        if (invalidServices.length > 0) {
          return NextResponse.json(
            { error: "Invalid additional services" },
            { status: 400 }
          );
        }
      }
    }

    // Create order
    const order = new Order({
      userId,
      items: items.map((item) => ({
        type: item.type,
        itemId: item.itemId,
        optionId: item.optionId,
        nama: item.nama,
        harga: item.harga,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        additionalServices: item.additionalServices,
      })),
      shippingInfo,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      voucherDiscount: voucherDiscount || 0,
      total,
      status: "pending", // Changed from "selesai" to "pending"
      cancellationReason: "",
    });

    // Save order
    await order.save();

    // Update stock for plants
    for (const item of items) {
      if (item.type === "plant") {
        await Plant.findByIdAndUpdate(item.itemId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // Clear cart
    await Cart.deleteOne({ userId });

    if (isDev) console.log(`Order created for user ${userId}:`, order._id);
    return NextResponse.json(
      { message: "Order created successfully", orderId: order._id },
      { status: 201 }
    );
  } catch (error) {
    if (isDev) console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order: " + error.message },
      { status: 500 }
    );
  }
}