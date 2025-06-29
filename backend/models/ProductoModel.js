import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  posicionSugerida: { type: String, required: true },
  activo: {
    type: Boolean,
    default: true
  }
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
