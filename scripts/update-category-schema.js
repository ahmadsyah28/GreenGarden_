// scripts/update-category-schema.js
// Script untuk mengupdate schema kategori yang sudah ada

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => {
    console.error('Gagal terhubung ke MongoDB', err);
    process.exit(1);
  });

// Definisi Schema Kategori (pastikan sama dengan model)
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

// Compound index untuk memastikan kombinasi name dan type unik
CategorySchema.index({ name: 1, type: 1 }, { unique: true });

// Mendapatkan model Category
const Category = mongoose.model('Category', CategorySchema);

// Fungsi untuk mengupdate schema kategori
async function updateCategorySchema() {
  try {
    console.log('Memulai update schema kategori...');
    
    // Ambil semua kategori yang ada
    const existingCategories = await Category.find({});
    console.log(`Ditemukan ${existingCategories.length} kategori`);
    
    // Update setiap kategori yang belum memiliki tipe
    for (const category of existingCategories) {
      // Jika tipe belum diset atau tidak valid
      if (!category.type || !['Tanaman', 'DesainTaman'].includes(category.type)) {
        console.log(`Mengupdate kategori: ${category.name} (ID: ${category._id})`);
        
        // Set default tipe 'Tanaman' untuk kategori lama
        category.type = 'Tanaman';
        await category.save();
        
        console.log(`✅ Kategori ${category.name} berhasil diupdate ke tipe 'Tanaman'`);
      } else {
        console.log(`⏭️ Kategori ${category.name} sudah memiliki tipe valid: ${category.type}`);
      }
    }
    
    console.log('Update schema kategori selesai!');
    
    // Refresh informasi koleksi
    await Category.collection.dropIndexes();
    await Category.createIndexes();
    console.log('Indeks berhasil diupdate');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Jalankan fungsi
updateCategorySchema();