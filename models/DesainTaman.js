import mongoose from "mongoose";

const DesainTamanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama desain harus diisi"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Harga desain harus diisi"],
    min: 0,
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: [true, "Deskripsi desain harus diisi"],
  },
  category: {
    type: String,
    required: [true, "Kategori desain harus diisi"],
  },
  status: {
    type: String,
    enum: ["Available", "Not Available"],
    default: "Available",
  },
  features: {
    type: [String],
    default: [],
  },
  minArea: {
    type: Number,
    default: 0,
  },
  maxArea: {
    type: Number,
    default: 0,
  },
  suitableFor: {
    type: String,
    default: "",
  },
  mainPlants: {
    type: [String],
    default: [],
  },
  estimatedTimeToFinish: {
    type: String,
    default: "",
  },
  additionalServices: {
    type: [
      {
        name: String,
        price: Number,
      },
    ],
    default: [],
  },
  care: {
    type: String,
    default: "",
  },
  requirements: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Logging pre-save untuk debugging
DesainTamanSchema.pre("save", function (next) {
  console.log("Menyimpan desain:", this);
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.DesainTaman || mongoose.model("DesainTaman", DesainTamanSchema);