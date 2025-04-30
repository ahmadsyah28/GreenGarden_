// scripts/seed-desain-categories.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => {
    console.error('Gagal terhubung ke MongoDB', err);
    process.exit(1);
  });

// Import model Category (disesuaikan)
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Nama kategori diperlukan'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Tanaman', 'DesainTaman'],
    default: 'Tanaman'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

CategorySchema.index({ name: 1, type: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Data kategori desain taman
const desainCategories = [
  { name: 'Minimalis', type: 'DesainTaman' },
  { name: 'Tropis', type: 'DesainTaman' },
  
];

// Fungsi untuk menginisialisasi kategori desain
async function seedDesainCategories() {
  try {
    // Insert kategori satu per satu, lewati jika sudah ada
    for (const category of desainCategories) {
      try {
        const existing = await Category.findOne({ 
          name: category.name,
          type: category.type
        });
        
        if (!existing) {
          await Category.create(category);
          console.log(`✅ Berhasil menambahkan kategori: ${category.name}`);
        } else {
          console.log(`⏩ Kategori sudah ada: ${category.name}`);
        }
      } catch (err) {
        console.error(`❌ Gagal menambahkan kategori ${category.name}:`, err.message);
      }
    }
    
    console.log('Inisialisasi kategori desain taman selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDesainCategories();