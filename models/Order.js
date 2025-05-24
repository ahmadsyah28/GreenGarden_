// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  address: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  processed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
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

OrderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);