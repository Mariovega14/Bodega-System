import Usuario from "../models/UsuarioModel.js";

// 🔐 Registrar nuevo usuario
export const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Verificar si ya existe el usuario
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Crear y guardar nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, email, password, rol });
    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar el usuario",
      detalle: error.message,
    });
  }
};
