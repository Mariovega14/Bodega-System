import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["admin", "operador"],
    default: "operador"
  }
});

export default mongoose.model("Usuario", usuarioSchema);
