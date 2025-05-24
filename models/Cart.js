const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Tambahkan indeks untuk query berdasarkan userId
  },
  items: [
    {
      plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true,
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
        default: '/placeholder-plant.png', // Default jika image tidak ada
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
}, {
  timestamps: true, // Tambahkan createdAt dan updatedAt untuk debugging
});

// Pastikan plantId unik dalam items untuk mencegah duplikasi
cartSchema.index({ userId: 1, 'items.plantId': 1 }, { unique: true });

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);