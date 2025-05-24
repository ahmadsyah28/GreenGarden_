// scripts/insertDummyData.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category");
const Plant = require("../models/Plant");
const DesainTaman = require("../models/Desain");
const GardenCare = require("../models/GardenCare");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const ServiceBooking = require("../models/ServiceBooking");

async function insertDummyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/GreenGarden", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Terhubung ke MongoDB");

    // Clear existing data (opsional, komentar jika ingin mempertahankan data)
    await User.deleteMany({});
    await Category.deleteMany({});
    await Plant.deleteMany({});
    await DesainTaman.deleteMany({});
    await GardenCare.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await ServiceBooking.deleteMany({});
    console.log("Data lama dihapus");

    // Create Users
    const admin = await User.create({
      name: "Admin Green Garden",
      email: "admin@greengarden.com",
      password: await bcrypt.hash("admin123", 10),
      phone: "08123456789",
      role: "admin",
    });

    const customer = await User.create({
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
      password: await bcrypt.hash("password123", 10),
      phone: "08765432100",
      role: "customer",
    });
    console.log("User dibuat:", admin.email, customer.email);

    // Create Categories
    const categories = await Category.create([
      { name: "Tanaman Indoor", type: "Tanaman" },
      { name: "Tanaman Outdoor", type: "Tanaman" },
      { name: "Desain Minimalis", type: "DesainTaman" },
      { name: "Desain Tropis", type: "DesainTaman" },
    ]);
    console.log("Kategori dibuat");

    // Create Plants
    const plants = await Plant.create([
      {
        name: "Monstera Deliciosa",
        category: categories[0].name, // Tanaman Indoor
        price: 150000,
        stock: 10,
        status: "In Stock",
        description:
          "Tanaman hias dengan daun berlubang, cocok untuk dekorasi dalam ruangan",
        care: "Cahaya tidak langsung, siram seminggu sekali",
        requirements: "Pot dengan drainase baik",
        image: "monstera.jpg",
      },
      {
        name: "Lidah Mertua",
        category: categories[1].name, // Tanaman Outdoor
        price: 100000,
        stock: 15,
        status: "In Stock",
        description: "Tanaman tahan banting, cocok untuk outdoor",
        care: "Cahaya matahari parsial, siram 2 minggu sekali",
        requirements: "Tanah kering",
        image: "lidah_mertua.jpg",
      },
    ]);
    console.log("Tanaman dibuat");

    // Create DesainTaman
    const desainTamans = await DesainTaman.create([
      {
        name: "Taman Minimalis Modern",
        price: 5000000,
        image: "taman_minimalis.jpg",
        description: "Desain taman modern untuk ruang kecil",
        category: categories[2].name, // Desain Minimalis
        status: "Available",
        features: ["Dekorasi batu", "Tanaman rendah perawatan"],
        minArea: 10,
        maxArea: 50,
        suitableFor: "Halaman depan",
        mainPlants: ["Lidah Mertua", "Kaktus"],
        estimatedTimeToFinish: "2 minggu",
        additionalServices: [{ name: "Pemasangan Irigasi", price: 1000000 }],
        care: "Perawatan minimal",
        requirements: "Akses air dan listrik",
      },
      {
        name: "Taman Tropis",
        price: 7500000,
        image: "taman_tropis.jpg",
        description: "Desain taman dengan nuansa tropis",
        category: categories[3].name, // Desain Tropis
        status: "Available",
        features: ["Kolam kecil", "Tanaman eksotis"],
        minArea: 20,
        maxArea: 100,
        suitableFor: "Halaman belakang",
        mainPlants: ["Palem", "Pisang Hias"],
        estimatedTimeToFinish: "3 minggu",
        additionalServices: [{ name: "Pencahayaan Taman", price: 1500000 }],
        care: "Perawatan rutin",
        requirements: "Akses air yang baik",
      },
    ]);
    console.log("Desain taman dibuat");

    // Create GardenCare
    const gardenCares = await GardenCare.create([
      {
        id: 1,
        title: "Perawatan Taman Bulanan",
        size: "Kecil (0-50 m²)",
        status: "Active",
        options: [
          { id: 1, name: "Pemangkasan Dasar", price: 500000 },
          { id: 2, name: "Pemupukan", price: 300000 },
        ],
      },
      {
        id: 2,
        title: "Perawatan Taman Premium",
        size: "Besar (50-200 m²)",
        status: "Active",
        options: [
          { id: 1, name: "Pemangkasan Kompleks", price: 1000000 },
          { id: 2, name: "Pembersihan Menyeluruh", price: 700000 },
        ],
      },
    ]);
    console.log("Perawatan taman dibuat");

    // Create Orders
    const orders = await Order.create([
      {
        user_id: customer._id,
        total_price: 400000,
        status: "pending",
        address: "Jl. Merdeka No. 123, Jakarta",
        payment_method: "Bank Transfer",
        created_at: new Date("2025-05-01"),
        updated_at: new Date("2025-05-01"),
      },
      {
        user_id: customer._id,
        total_price: 5250000,
        status: "processing",
        address: "Jl. Sudirman No. 45, Bandung",
        payment_method: "Credit Card",
        processed_by: admin._id,
        created_at: new Date("2025-05-05"),
        updated_at: new Date("2025-05-06"),
      },
      {
        user_id: customer._id,
        total_price: 1100000,
        status: "completed",
        address: "Jl. Gatot Subroto No. 78, Surabaya",
        payment_method: "Cash on Delivery",
        processed_by: admin._id,
        created_at: new Date("2025-04-20"),
        updated_at: new Date("2025-04-25"),
      },
    ]);
    console.log("Pesanan dibuat");

    // Create Order Items
    const orderItems = await OrderItem.create([
      {
        order_id: orders[0]._id,
        item_id: plants[0]._id,
        item_type: "plant",
        quantity: 2,
        price: 150000,
        subtotal: 300000,
      },
      {
        order_id: orders[0]._id,
        item_id: plants[1]._id,
        item_type: "plant",
        quantity: 1,
        price: 100000,
        subtotal: 100000,
      },
      {
        order_id: orders[1]._id,
        item_id: desainTamans[0]._id,
        item_type: "desain_taman",
        quantity: 1,
        price: 5000000,
        subtotal: 5000000,
      },
      {
        order_id: orders[1]._id,
        item_id: plants[0]._id,
        item_type: "plant",
        quantity: 1,
        price: 150000,
        subtotal: 150000,
      },
      {
        order_id: orders[2]._id,
        item_id: gardenCares[0]._id,
        item_type: "garden_care",
        quantity: 1,
        price: 500000,
        subtotal: 500000,
      },
      {
        order_id: orders[2]._id,
        item_id: gardenCares[0]._id,
        item_type: "garden_care",
        quantity: 1,
        price: 300000,
        subtotal: 300000,
      },
      {
        order_id: orders[2]._id,
        item_id: plants[1]._id,
        item_type: "plant",
        quantity: 3,
        price: 100000,
        subtotal: 300000,
      },
    ]);
    console.log("Item pesanan dibuat");

    // Create Service Bookings
    const serviceBookings = await ServiceBooking.create([
      {
        user_id: customer._id,
        order_id: orders[1]._id,
        service_id: gardenCares[0]._id,
        date: new Date("2025-05-10"),
        time: "10:00",
        status: "pending",
        address: "Jl. Sudirman No. 45, Bandung",
        notes: "Mohon pastikan alat pemangkasan tersedia",
        confirmed_by: null,
        created_at: new Date("2025-05-05"),
        updated_at: new Date("2025-05-05"),
      },
      {
        user_id: customer._id,
        order_id: orders[2]._id,
        service_id: gardenCares[1]._id,
        date: new Date("2025-04-22"),
        time: "14:00",
        status: "confirmed",
        address: "Jl. Gatot Subroto No. 78, Surabaya",
        notes: "Fokus pada pembersihan daun kering",
        confirmed_by: admin._id,
        created_at: new Date("2025-04-20"),
        updated_at: new Date("2025-04-21"),
      },
    ]);
    console.log("Booking layanan dibuat");

    console.log("Dummy data berhasil dimasukkan!");
  } catch (error) {
    console.error("Error saat memasukkan dummy data:", error);
  } finally {
    mongoose.connection.close();
  }
}

insertDummyData();