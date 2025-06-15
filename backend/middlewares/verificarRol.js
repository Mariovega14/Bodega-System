export function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {
      const usuario = req.body.usuario || req.usuario;
  
      if (!usuario || !usuario.rol) {
        return res.status(401).json({ error: "Rol no proporcionado" });
      }
  
      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({ error: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` });
      }
  
      next();
    };
  }
  