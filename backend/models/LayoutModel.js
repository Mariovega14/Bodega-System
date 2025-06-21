import mongoose from "mongoose";

const LayoutSchema = new mongoose.Schema({
  coordenada: { type: String, required: true, unique: true },
  tipo: { type: String }, // ALMACENAMIENTO, etc.
  nivel: { type: Number },
  capacidad: { type: Number },
  sku: { type: String, default: "" },
  nombreProducto: { type: String, default: "" },
  cantidad: { type: Number, default: 0 },
  estado: { type: String, default: "Vacío" },
  fechaVencimiento: { type: Date, default: null },
  fechaUltimoMov: { type: Date, default: null }
}, {
  timestamps: true,
  collection: "layout" // ✅ clave para que acceda a la colección correcta
});

// 👇 Exportación debe ir al final
export default mongoose.model("Layout", LayoutSchema, "layout");
