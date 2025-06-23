import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Producto from "../models/ProductoModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();

    const layout = await Promise.all(
      ubicaciones.map(async (ubi) => {
        const coordenada = `${ubi.pasillo}-${ubi.posicion}-${ubi.nivel}`;

        let nombreProducto = null;
        if (ubi.sku) {
          const producto = await Producto.findOne({ sku: ubi.sku });
          nombreProducto = producto?.nombre || "Producto desconocido";
        }

        const estado = !ubi.sku
          ? "Vacío"
          : ubi.cantidad >= ubi.capacidad
          ? "Lleno"
          : "Ocupado";

        return {
          coordenada,
          tipo: ubi.tipo,
          nivel: ubi.nivel,
          capacidad: ubi.capacidad,
          sku: ubi.sku,
          nombreProducto,
          cantidad: ubi.cantidad || 0,
          estado,
          fechaVencimiento: ubi.fechaVencimiento || null,
          fechaUltimoMov: ubi.fechaMovimiento || null,
        };
      })
    );

    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener layout", detalle: error.message });
  }
});

export default router;
