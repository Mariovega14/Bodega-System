import mongoose from "mongoose";

const UbicacionSchema = new mongoose.Schema({
  pasillo: { type: String, required: true },
  posicion: { type: String, required: true },
  nivel: { type: Number, required: true },
  tipo: { type: String, required: true },
  capacidad: { type: Number, default: 1 },
  coordenada: { type: String, required: true, unique: true },

  // Nuevos campos:
  sku: { type: String, default: null },           // SKU del producto asignado
  estado: { type: String, default: "0" },         // "0" = vacío, "1" = ocupado
  fechaMovimiento: { type: Date, default: null }, // Fecha del último ingreso
  fechaVencimiento: { type: Date, default: null } // Fecha de vencimiento del producto

}, { timestamps: true });

export default mongoose.model("Ubicacion", UbicacionSchema);
