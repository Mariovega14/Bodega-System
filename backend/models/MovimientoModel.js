import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema({
  sku: String,
  coordenada: String,
  tipo: String, // "Ingreso" o "Salida"
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Movimiento", movimientoSchema);
