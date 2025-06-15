import express from "express";
import { registrarUsuario } from "../controllers/UsuarioController.js";
import Usuario from "../models/UsuarioModel.js";


const router = express.Router();

// Ruta para registrar usuario
router.post("/register", registrarUsuario);

export default router;

// ⚠️ Ruta temporal para cambiar el rol de un usuario (por ejemplo, a "admin")
router.put("/cambiar-rol", async (req, res) => {
  const { email, nuevoRol } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    usuario.rol = nuevoRol;
    await usuario.save();

    res.json({ message: "Rol actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rol" });
  }
});
// ⚠️ Ruta temporal solo para listar todos los usuarios (para debug)
router.get("/listar", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});
