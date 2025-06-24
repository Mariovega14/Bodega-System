import express from "express";
import Usuario from "../models/UsuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// 📌 Registrar usuario
router.post("/registro", async (req, res) => {
  const { usuario, password, rol } = req.body;

  try {
    const existe = await Usuario.findOne({ usuario });
    if (existe) return res.status(400).json({ error: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      usuario,
      password: hashedPassword,
      rol,
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario", detalle: error.message });
  }
});

// 📌 Login de usuario
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await Usuario.findOne({ usuario });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const coincide = await bcrypt.compare(password, user.password);
    if (!coincide) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      usuario: {
        usuario: user.usuario,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en login", detalle: error.message });
  }
});

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password"); // ocultamos el campo sensible
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// 🗑 Eliminar usuario por ID
export const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};


router.get("/", obtenerUsuarios);
router.delete("/:id", eliminarUsuario);

export default router;
