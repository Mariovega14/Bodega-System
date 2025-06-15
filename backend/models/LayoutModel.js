import mongoose from "mongoose";

const LayoutSchema = new mongoose.Schema({
  coordenada: { type: String, required: true, unique: true },
  sku: { type: String, default: "" },
  nombre: { type: String, default: "" },
  estado: { type: Number, default: 0 }  // 0: Vacío, 1: Ocupado
}, { timestamps: true });

export default mongoose.model("Layout", LayoutSchema);
