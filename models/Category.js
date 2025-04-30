// models/Category.js
import mongoose from 'mongoose';

// Reset model jika sudah ada (untuk development)
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nama kategori diperlukan'],
    trim: true  // Menghapus spasi di awal dan akhir
  },
  type: {
    type: String,
    enum: {
      values: ['Tanaman', 'DesainTaman'],
      message: '{VALUE} bukan tipe kategori yang valid'
    },
    default: 'Tanaman'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index untuk memastikan kombinasi name dan type unik
CategorySchema.index({ name: 1, type: 1 }, { unique: true });

// Debugging
CategorySchema.pre('save', function(next) {
  console.log('Menyimpan kategori:', this);
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;