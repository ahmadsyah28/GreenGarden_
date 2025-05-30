// src/app/api/cart/route.js (Updated with proper DELETE method)
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongo from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Plant from "@/models/Plant";
import DesainTaman from "@/models/DesainTaman";
import GardenCare from "@/models/GardenCare";

const isDev = process.env.NODE_ENV === "development";

export async function POST(request) {
  await connectMongo();
  
  try {
    const { type, itemId, optionId, quantity, userId, additionalServices, size } = await request.json();

    if (!userId || !type || !itemId || (type === "maintenance" && !optionId)) {
      return NextResponse.json(
        { error: "User ID, type, itemId, dan optionId (untuk perawatan) wajib diisi" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Format itemId atau userId tidak valid" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Jumlah harus bilangan bulat positif" }, { status: 400 });
    }
    if (type === "maintenance" && !Number.isInteger(optionId)) {
      return NextResponse.json({ error: "optionId harus berupa angka" }, { status: 400 });
    }

    let Model, item, gardenCareDoc;
    if (type === "plant") {
      Model = Plant;
      item = await Model.findById(itemId);
    } else if (type === "design") {
      Model = DesainTaman;
      item = await Model.findById(itemId);
    } else if (type === "maintenance") {
      Model = GardenCare;
      gardenCareDoc = await Model.findById(itemId);
      if (gardenCareDoc) {
        item = gardenCareDoc.options.find((opt) => opt.id === optionId);
      }
    } else {
      return NextResponse.json(
        { error: "Tipe item tidak valid. Harus plant, design, atau maintenance" },
        { status: 400 }
      );
    }

    if (!item) {
      return NextResponse.json({ error: `${type} tidak ditemukan` }, { status: 404 });
    }

    if (type === "plant" && item.stock < quantity) {
      return NextResponse.json({ error: `Stok tidak cukup: ${item.stock} tersedia` }, { status: 400 });
    }

    if (type === "plant" && item.status === "Out of Stock") {
      return NextResponse.json({ error: "Tanaman kehabisan stok" }, { status: 400 });
    }
    if (type === "design" && item.status === "Not Available") {
      return NextResponse.json({ error: "Desain tidak tersedia" }, { status: 400 });
    }
    if (type === "maintenance" && gardenCareDoc.status === "Inactive") {
      return NextResponse.json({ error: "Layanan perawatan tidak aktif" }, { status: 400 });
    }

    if (type === "design" && additionalServices) {
      if (!Array.isArray(additionalServices)) {
        return NextResponse.json({ error: "additionalServices harus berupa array" }, { status: 400 });
      }
      const validServices = item.additionalServices.map((s) => s.name);
      const invalidServices = additionalServices.filter((s) => !validServices.includes(s.name));
      if (invalidServices.length > 0) {
        return NextResponse.json({ error: "Layanan tambahan tidak valid" }, { status: 400 });
      }
    }

    if (type === "maintenance" && !size) {
      return NextResponse.json(
        { error: "Ukuran wajib diisi untuk layanan perawatan" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (cartItem) =>
        cartItem.type === type &&
        cartItem.itemId.toString() === itemId &&
        (type !== "maintenance" || cartItem.optionId === optionId)
    );

    const itemData = {
      type,
      itemId,
      quantity,
      harga: item.price,
      nama: item.name || item.title,
      image: item.image || "/placeholder-item.png",
    };

    if (type === "plant") {
      itemData.stock = item.stock;
    } else if (type === "maintenance") {
      itemData.optionId = optionId;
      itemData.size = size;
      itemData.nama = `${gardenCareDoc.title} - ${item.name}`;
    } else if (type === "design" && additionalServices) {
      itemData.additionalServices = additionalServices;
      itemData.harga += additionalServices.reduce((sum, s) => sum + (s.price || 0), 0);
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].harga = itemData.harga;
      cart.items[itemIndex].nama = itemData.nama;
      cart.items[itemIndex].image = itemData.image;
      if (type === "plant") {
        cart.items[itemIndex].stock = itemData.stock;
      } else if (type === "maintenance") {
        cart.items[itemIndex].optionId = itemData.optionId;
        cart.items[itemIndex].size = itemData.size;
      } else if (type === "design") {
        cart.items[itemIndex].additionalServices = itemData.additionalServices;
      }
    } else {
      cart.items.push(itemData);
    }

    if (type === "plant" && itemIndex > -1 && cart.items[itemIndex].stock < cart.items[itemIndex].quantity) {
      return NextResponse.json(
        { error: `Stok tidak cukup: ${item.stock} tersedia` },
        { status: 400 }
      );
    }

    await cart.save();
    if (isDev) console.log(`Item ditambahkan ke keranjang untuk user ${userId}:`, {
      type,
      itemId,
      optionId,
      quantity,
    });
    return NextResponse.json(
      { message: "Item ditambahkan ke keranjang", cart },
      { status: 200 }
    );
  } catch (error) {
    if (isDev) console.error("Error menambahkan ke keranjang:", error);
    return NextResponse.json(
      { error: `Gagal menambahkan ke keranjang: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectMongo();
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      if (isDev) console.log(`No cart found for userId: ${userId}`);
      return NextResponse.json([], { status: 200 });
    }

    const items = cart.items
      .filter((item) => item.itemId && mongoose.Types.ObjectId.isValid(item.itemId))
      .map((item) => ({
        id: item.itemId.toString(),
        type: item.type,
        itemId: item.itemId.toString(),
        optionId: item.optionId,
        nama: item.nama,
        harga: item.harga,
        quantity: item.quantity,
        image: item.image,
        stock: item.stock,
        size: item.size,
        additionalServices: item.additionalServices,
      }));

    if (isDev) console.log(`Cart retrieved for user ${userId}:`, items);
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    if (isDev) console.error("Error retrieving cart:", error);
    return NextResponse.json(
      { error: `Failed to retrieve cart: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  await connectMongo();
  
  try {
    const { type, itemId, optionId, quantity, userId, additionalServices, size } = await request.json();

    if (!userId || !type || !itemId || !quantity || (type === "maintenance" && !optionId)) {
      return NextResponse.json(
        { error: "User ID, type, itemId, quantity, dan optionId (untuk perawatan) wajib diisi" },
        { status: 400 }
      );
    }
    if (type === "maintenance" && !size) {
      return NextResponse.json(
        { error: "Ukuran wajib diisi untuk layanan perawatan" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Format itemId atau userId tidak valid" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Jumlah harus bilangan bulat positif" }, { status: 400 });
    }
    if (type === "maintenance" && !Number.isInteger(optionId)) {
      return NextResponse.json({ error: "optionId harus berupa angka" }, { status: 400 });
    }

    let Model, item, gardenCareDoc;
    if (type === "plant") {
      Model = Plant;
      item = await Model.findById(itemId);
    } else if (type === "design") {
      Model = DesainTaman;
      item = await Model.findById(itemId);
    } else if (type === "maintenance") {
      Model = GardenCare;
      gardenCareDoc = await Model.findById(itemId);
      if (gardenCareDoc) {
        item = gardenCareDoc.options.find((opt) => opt.id === optionId);
      }
    } else {
      return NextResponse.json({ error: "Tipe item tidak valid" }, { status: 400 });
    }

    if (!item) {
      return NextResponse.json({ error: `${type} tidak ditemukan` }, { status: 404 });
    }

    if (type === "plant" && item.stock < quantity) {
      return NextResponse.json({ error: `Stok tidak cukup: ${item.stock} tersedia` }, { status: 400 });
    }

    if (type === "plant" && item.status === "Out of Stock") {
      return NextResponse.json({ error: "Tanaman kehabisan stok" }, { status: 400 });
    }
    if (type === "design" && item.status === "Not Available") {
      return NextResponse.json({ error: "Desain tidak tersedia" }, { status: 400 });
    }
    if (type === "maintenance" && gardenCareDoc.status === "Inactive") {
      return NextResponse.json({ error: "Layanan perawatan tidak aktif" }, { status: 400 });
    }

    if (type === "design" && additionalServices) {
      if (!Array.isArray(additionalServices)) {
        return NextResponse.json(
          { error: "additionalServices harus berupa array" },
          { status: 400 }
        );
      }
      const validServices = item.additionalServices.map((s) => s.name);
      const invalidServices = additionalServices.filter((s) => !validServices.includes(s.name));
      if (invalidServices.length > 0) {
        return NextResponse.json({ error: "Layanan tambahan tidak valid" }, { status: 400 });
      }
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Keranjang tidak ditemukan" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (cartItem) =>
        cartItem.type === type &&
        cartItem.itemId.toString() === itemId &&
        (type !== "maintenance" || cartItem.optionId === optionId)
    );
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item tidak ditemukan di keranjang" }, { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].harga = item.price;
    cart.items[itemIndex].nama =
      type === "maintenance" ? `${gardenCareDoc.title} - ${item.name}` : item.name || item.title;
    cart.items[itemIndex].image = item.image || "/placeholder-item.png";

    if (type === "plant") {
      cart.items[itemIndex].stock = item.stock;
    } else if (type === "maintenance") {
      cart.items[itemIndex].optionId = optionId;
      cart.items[itemIndex].size = size;
    } else if (type === "design" && additionalServices) {
      cart.items[itemIndex].additionalServices = additionalServices;
      cart.items[itemIndex].harga += additionalServices.reduce(
        (sum, s) => sum + (s.price || 0),
        0
      );
    }

    await cart.save();
    if (isDev)
      console.log(`Jumlah item diperbarui untuk user ${userId}:`, {
        type,
        itemId,
        optionId,
        quantity,
      });
    return NextResponse.json(
      { message: "Jumlah item diperbarui", cart },
      { status: 200 }
    );
  } catch (error) {
    if (isDev) console.error("Error memperbarui keranjang:", error);
    return NextResponse.json(
      { error: `Gagal memperbarui keranjang: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectMongo();
  
  try {
    const { type, itemId, optionId, userId, clearAll } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }

    if (clearAll) {
      const result = await Cart.deleteOne({ userId });
      
      if (result.deletedCount === 0) {
        if (isDev) console.log(`No cart found to clear for userId: ${userId}`);
        return NextResponse.json({ message: "Cart was already empty" }, { status: 200 });
      }
      
      if (isDev) console.log(`Cart cleared for user ${userId}`);
      return NextResponse.json({ message: "Cart cleared successfully" }, { status: 200 });
    }

    if (!type || !itemId || (type === "maintenance" && !optionId)) {
      return NextResponse.json(
        { error: "User ID, type, itemId, dan optionId (untuk perawatan) wajib diisi" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: "Format itemId tidak valid" }, { status: 400 });
    }
    if (type === "maintenance" && !Number.isInteger(optionId)) {
      return NextResponse.json({ error: "optionId harus berupa angka" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: "Keranjang tidak ditemukan" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      (cartItem) =>
        cartItem.type === type &&
        cartItem.itemId.toString() === itemId &&
        (type !== "maintenance" || cartItem.optionId === optionId)
    );
    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item tidak ditemukan di keranjang" }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    if (isDev) console.log(`Item dihapus dari keranjang untuk user ${userId}:`, {
      type,
      itemId,
      optionId,
    });
    return NextResponse.json(
      { message: "Item dihapus dari keranjang", cart },
      { status: 200 }
    );
  } catch (error) {
    if (isDev) console.error("Error deleting from cart:", error);
    return NextResponse.json(
      { error: `Gagal menghapus item: ${error.message}` },
      { status: 500 }
    );
  }
}