import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "operador", "supervisor"],
    required: true,
  },
});

export default mongoose.model("Usuario", UsuarioSchema);