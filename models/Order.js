import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: [
      {
        type: {
          type: String,
          enum: ["plant", "design", "maintenance"],
          required: true,
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "items.type",
          required: true,
        },
        optionId: {
          type: Number,
          required: function () {
            return this.type === "maintenance";
          },
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        harga: {
          type: Number,
          required: true,
        },
        nama: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          default: "/placeholder-item.png",
        },
        size: {
          type: String,
          required: function () {
            return this.type === "maintenance";
          },
        },
        additionalServices: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],
    shippingInfo: {
      nama: { type: String, required: true },
      email: { type: String, required: true },
      nomorTelepon: { type: String, required: true },
      alamat: { type: String, required: true },
      kota: { type: String, required: true },
      kodePos: { type: String, required: true },
      catatan: { type: String },
    },
    shippingMethod: {
      type: String,
      enum: ["regular", "express"],
      required: true,
    },
    shippingCost: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["transfer", "ewallet", "cod"],
      required: true,
    },
    subtotal: { type: Number, required: true },
    voucherDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "selesai", "cancelled"],
      default: "pending",
    },
    cancellationReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);