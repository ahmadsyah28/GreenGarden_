// src/app/api/cart/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Plant from '@/models/Plant';

export async function POST(request) {
  await connectMongo();
  const { plantId, quantity, userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(plantId) || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid plantId or quantity' }, { status: 400 });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }
    if (plant.stock < quantity) {
      return NextResponse.json({ error: `Insufficient stock: ${plant.stock} available` }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.plantId.toString() === plantId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].harga = plant.price;
      cart.items[itemIndex].nama = plant.name;
      cart.items[itemIndex].image = plant.image || '/placeholder-plant.png';
      cart.items[itemIndex].stock = plant.stock;
    } else {
      cart.items.push({
        plantId,
        quantity,
        harga: plant.price,
        nama: plant.name,
        image: plant.image || '/placeholder-plant.png',
        stock: plant.stock,
      });
    }

    await cart.save();
    console.log(`Item added to cart for user ${userId}:`, { plantId, quantity });
    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart: ' + error.message }, { status: 500 });
  }
}

export async function GET(request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items.map(item => ({
      id: item.plantId.toString(),
      plantId: item.plantId.toString(),
      nama: item.nama,
      harga: item.harga,
      quantity: item.quantity,
      image: item.image,
      stock: item.stock,
    })) : [];

    console.log(`Fetched cart for user ${userId}:`, items);
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  await connectMongo();
  const { plantId, quantity, userId } = await request.json();

  if (!userId || !plantId || !quantity) {
    return NextResponse.json({ error: 'User ID, plantId, and quantity required' }, { status: 400 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(plantId) || !mongoose.Types.ObjectId.isValid(userId) || quantity < 1) {
      return NextResponse.json({ error: 'Invalid plantId, userId, or quantity' }, { status: 400 });
    }

    const plant = await Plant.findById(plantId);
    if (!plant) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }
    if (plant.stock < quantity) {
      return NextResponse.json({ error: `Insufficient stock: ${plant.stock} available` }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item) => item.plantId.toString() === plantId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].harga = plant.price;
    cart.items[itemIndex].nama = plant.name;
    cart.items[itemIndex].image = plant.image || '/placeholder-plant.png';
    cart.items[itemIndex].stock = plant.stock;

    await cart.save();
    console.log(`Item quantity updated for user ${userId}:`, { plantId, quantity });
    return NextResponse.json({ message: 'Item quantity updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectMongo();
  const { plantId, userId } = await request.json();

  if (!userId || !plantId) {
    return NextResponse.json({ error: 'User ID and plantId required' }, { status: 400 });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(plantId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid plantId or userId' }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item) => item.plantId.toString() === plantId);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    console.log(`Item removed from cart for user ${userId}:`, { plantId });
    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item: ' + error.message }, { status: 500 });
  }
}