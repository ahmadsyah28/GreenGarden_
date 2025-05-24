// models/ServiceBooking.js
import mongoose from "mongoose";

const ServiceBookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PerawatanTaman",
    required: true,
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  address: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: null,
  },
  confirmed_by: {
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

ServiceBookingSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.ServiceBooking ||
  mongoose.model("ServiceBooking", ServiceBookingSchema);