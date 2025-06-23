export function verificarRol(rolPermitido) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== rolPermitido) {
      return res.status(403).json({ error: "Acceso denegado. Rol insuficiente." });
    }
    next();
  };
}