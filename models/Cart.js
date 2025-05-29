// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: [
    {
      type: {
        type: String,
        enum: ['plant', 'design', 'maintenance'],
        required: true,
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'items.type',
        required: true,
      },
      optionId: {
        type: Number,
        required: function () {
          return this.type === 'maintenance';
        },
      }, // ID opsi untuk perawatan taman
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
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
        default: '/placeholder-item.png',
      },
      stock: {
        type: Number,
        required: function () {
          return this.type === 'plant';
        },
        min: 0,
      },
      size: {
        type: String,
        required: function () {
          return this.type === 'maintenance';
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
}, {
  timestamps: true,
});

// Indeks unik untuk mencegah duplikasi item
cartSchema.index(
  { userId: 1, 'items.type': 1, 'items.itemId': 1, 'items.optionId': 1 },
  { unique: true, partialFilterExpression: { 'items.optionId': { $exists: true } } }
);

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);