// src/models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      plantId: String,
      nama: String,
      harga: Number,
      quantity: Number,
      image: String,
    },
  ],
  shippingInfo: {
    nama: String,
    email: String,
    nomorTelepon: String,
    alamat: String,
    kota: String,
    kodePos: String,
    catatan: String,
  },
  shippingMethod: {
    type: String,
    enum: ['regular', 'express'],
    required: true,
  },
  shippingCost: Number,
  paymentMethod: {
    type: String,
    enum: ['transfer', 'ewallet', 'cod'],
    required: true,
  },
  subtotal: Number,
  voucherDiscount: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'selesai', 'cancelled'],
    default: 'pending',
  },
  cancellationReason: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);