import mongoose  from "mongoose";

const PlantSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama Tanaman diperlukan']
    },
    category: {
        type: String,
        required: [true, 'Kategori diperlukan']
    },
    price: {
        type: Number,
        required: [true, 'Harga diperlukan']
    },
    stock:{
        type: Number,
        required: [true,'Stok diperlukan'],
        default: 0
    },
    status:{
        type:String,
        enum: [ 'In Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    description:{
        type: String,
        required: [true, 'Deskripsi diperlukan']
    },
    care:{
        type:String
    },
    requirements:{
        type:String
    },
    image:{
        type:String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
      },
})

// Mengecek apakah model sudah ada untuk mencegah error kompilasi ulang
export default mongoose.models.Plant || mongoose.model('Plant', PlantSchema);