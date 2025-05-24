import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi penyimpanan file menggunakan multer
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

// Middleware untuk menangani upload file
const uploadMiddleware = upload.single("featuredImage");

// Fungsi untuk menjalankan middleware multer
const runMiddleware = (req, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, {}, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// GET - Mendapatkan semua blog atau blog berdasarkan ID
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const blog = await Blog.findById(id);
      if (!blog) {
        return NextResponse.json({ error: "Blog tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Menambahkan blog baru
export async function POST(request) {
  try {
    await connectToDatabase();

    const req = {
      body: {},
      file: null,
    };

    // Jalankan middleware untuk menangani upload file
    await runMiddleware(request, uploadMiddleware);

    // Parsing body dari FormData
    const formData = await request.formData();
    req.body = {
      title: formData.get("title"),
      category: formData.get("category"),
      content: formData.get("content"),
      author: formData.get("author"),
      status: formData.get("status"),
      tags: formData.get("tags") ? JSON.parse(formData.get("tags")) : [],
      featured: formData.get("featured") === "true",
    };
    req.file = formData.get("featuredImage");

    // Simpan file gambar
    let imagePath = null;
    if (req.file) {
      const filename = Date.now() + path.extname(req.file.name);
      const filePath = `./public/uploads/${filename}`;
      const buffer = await req.file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      imagePath = `/uploads/${filename}`;
    }

    // Buat blog baru
    const blog = await Blog.create({
      ...req.body,
      featuredImage: imagePath,
      views: 0,
      gallery: [],
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT - Memperbarui blog (termasuk views)
export async function PUT(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const data = await request.json();
    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Menghapus blog
export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog tidak ditemukan" }, { status: 404 });
    }

    // Hapus file gambar dari server jika ada
    if (blog.featuredImage) {
      const filePath = `./public${blog.featuredImage}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return NextResponse.json({ message: "Blog berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}