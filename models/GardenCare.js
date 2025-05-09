// models/GardenCare.js
import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const GardenCareSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  size: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  options: [OptionSchema],
});

export default mongoose.models.GardenCare ||
  mongoose.model("GardenCare", GardenCareSchema);