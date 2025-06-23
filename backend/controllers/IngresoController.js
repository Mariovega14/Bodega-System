// controllers/IngresoController.js
import Producto from "../models/ProductoModel.js";
import Ubicacion from "../models/UbicacionModel.js";

export const ingresarProductos = async (req, res) => {
  const productos = req.body; // Array de objetos: [{ sku, fechaVencimiento, cantidad }]

  const resultados = [];

  for (const producto of productos) {
    const { sku, fechaVencimiento, cantidad } = producto;

    try {
      // 1. Buscar producto en catálogo
      const productoCatalogo = await Producto.findOne({ sku });
      if (!productoCatalogo) {
        resultados.push({ sku, estado: "error", mensaje: "SKU no encontrado en catálogo" });
        continue;
      }

      // 2. Obtener posición sugerida
      const posicionSugerida = productoCatalogo.posicionSugerida;
      if (!posicionSugerida) {
        resultados.push({ sku, estado: "error", mensaje: "Producto sin posición sugerida" });
        continue;
      }

      // 3. Verificar si está disponible
      const ubicacionDisponible = await Ubicacion.findOne({
        coordenada: posicionSugerida,
        estado: "Vacío",
      });

      if (!ubicacionDisponible) {
        resultados.push({ sku, estado: "error", mensaje: "No hay espacio en posición sugerida" });
        continue;
      }

      // 4. Asignar producto
      ubicacionDisponible.sku = sku;
      // Convierte la fecha a tipo Date si viene como string
      ubicacionDisponible.fechaVencimiento = fechaVencimiento ? new Date(fechaVencimiento) : null;
      ubicacionDisponible.cantidad = cantidad;
      ubicacionDisponible.estado = "Ocupado";
      ubicacionDisponible.fechaMovimiento = new Date();

      await ubicacionDisponible.save();

      resultados.push({
        sku,
        estado: "ok",
        mensaje: `Ingresado en ${posicionSugerida}`,
      });
    } catch (error) {
      resultados.push({ sku, estado: "error", mensaje: error.message });
    }
  }

  return res.status(200).json({ resultados });
};
