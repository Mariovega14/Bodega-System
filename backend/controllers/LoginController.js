import Usuario from "../models/UsuarioModel.js";

// 🔐 Iniciar sesión
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión", detalle: error.message });
  }
};
