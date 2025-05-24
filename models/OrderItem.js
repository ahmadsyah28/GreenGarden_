// models/OrderItem.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  item_type: {
    type: String,
    enum: ["tanaman_hias", "design_taman", "perawatan_taman"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

OrderItemSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema);