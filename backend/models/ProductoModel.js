import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, default: "General" },
  centroCosto: { type: String, default: "-" },
  posicionSugerida: { type: String, required: true }  
}, { timestamps: true });

export default mongoose.model("Producto", ProductoSchema);
