// controllers/IngresoAutomaticoController.js
import Producto from "../models/ProductoModel.js";
import Ubicacion from "../models/UbicacionModel.js";

export const ingresoAutomatico = async (req, res) => {
  try {
    const { sku } = req.body;

    const producto = await Producto.findOne({ sku });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    const sugerida = producto.posicionSugerida;
    const ubicacionSugerida = await Ubicacion.findOne({ coordenada: sugerida, estado: "vacío" });

    if (ubicacionSugerida) {
      ubicacionSugerida.estado = "lleno";
      ubicacionSugerida.sku = sku;
      ubicacionSugerida.cantidad = 1;
      await ubicacionSugerida.save();
      return res.json({ mensaje: "Ingreso en posición sugerida", coordenada: sugerida });
    }

    // Si está ocupada, buscar la más cercana (orden: nivel → posición → pasillo)
    const disponibles = await Ubicacion.find({ estado: "vacío" });
    if (disponibles.length === 0) return res.status(400).json({ error: "No hay ubicaciones disponibles" });

    const ordenadas = disponibles.sort((a, b) => {
      if (a.pasillo !== b.pasillo) return a.pasillo.localeCompare(b.pasillo);
      if (a.posicion !== b.posicion) return a.posicion - b.posicion;
      return a.nivel - b.nivel;
    });

    const seleccionada = ordenadas[0];
    seleccionada.estado = "lleno";
    seleccionada.sku = sku;
    seleccionada.cantidad = 1;
    await seleccionada.save();

    res.json({ mensaje: "Ingreso en ubicación alternativa", coordenada: seleccionada.coordenada });
  } catch (err) {
    res.status(500).json({ error: "Error en el ingreso", detalle: err.message });
  }
};
