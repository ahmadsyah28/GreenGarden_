// scripts/check-model-schema.js
// Script untuk memeriksa model schema dan memastikan statusnya benar

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch(err => {
    console.error('Gagal terhubung ke MongoDB', err);
    process.exit(1);
  });

// Hapus model jika sudah didefinisikan sebelumnya
if (mongoose.models.DesainTaman) {
  delete mongoose.models.DesainTaman;
}

// Definisi schema untuk debugging
const DesainTamanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama desain harus diisi'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Harga desain harus diisi'],
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Deskripsi desain harus diisi']
  },
  category: {
    type: String,
    required: [true, 'Kategori desain harus diisi']
  },
  status: {
    type: String,
    enum: ['Available', 'Not Available'],
    default: 'Available'
  },
  features: {
    type: [String],
    default: []
  },
  minArea: {
    type: Number,
    default: 0
  },
  maxArea: {
    type: Number,
    default: 0
  },
  suitableFor: {
    type: String,
    default: ''
  },
  mainPlants: {
    type: [String],
    default: []
  },
  estimatedTimeToFinish: {
    type: String,
    default: ''
  },
  additionalServices: {
    type: [{
      name: String,
      price: Number
    }],
    default: []
  },
  care: {
    type: String,
    default: ''
  },
  requirements: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Buat model
const DesainTaman = mongoose.model('DesainTaman', DesainTamanSchema);

// Tampilkan informasi schema
console.log('Path status:');
console.log(DesainTamanSchema.path('status'));
console.log('\nValid enum values untuk status:');
console.log(DesainTamanSchema.path('status').enumValues);

// Coba validasi data sampel
const testDesain = new DesainTaman({
  name: "Taman Minimalis",
  category: "Minimalis",
  price: 1500000,
  description: "Desain taman minimalis yang indah",
  status: "Available"
});

// Validasi model
testDesain.validate()
  .then(() => {
    console.log('\nValidasi berhasil!');
    console.log(testDesain);
    
    // Coba status lain
    return Promise.all([
      validateStatus('Available'),
      validateStatus('Not Available'),
      validateStatus('Invalid Status')
    ]);
  })
  .then(() => {
    console.log('\nPengecekan schema selesai!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\nValidasi gagal:', err);
    process.exit(1);
  });

// Fungsi untuk validasi status
async function validateStatus(statusValue) {
  try {
    const test = new DesainTaman({
      name: "Test Desain",
      category: "Test",
      price: 1000,
      description: "Test description",
      status: statusValue
    });
    
    await test.validate();
    console.log(`Status "${statusValue}" valid`);
    return true;
  } catch (error) {
    console.log(`Status "${statusValue}" tidak valid:`, error.message);
    return false;
  }
}