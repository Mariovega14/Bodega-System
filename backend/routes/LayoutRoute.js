import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Movimiento from "../models/MovimientoModel.js";
import Producto from "../models/ProductoModel.js"; // si tienes relación para nombreProducto

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();

    // Aquí simularé que cada coordenada tiene su información actual
    const layout = await Promise.all(
      ubicaciones.map(async (ubi) => {
        const coordenada = `${ubi.pasillo}-${ubi.posicion}-${ubi.nivel}`;

        // Buscar el último movimiento para esta coordenada
        const ultimoMovimiento = await Movimiento.findOne({ coordenada }).sort({ fecha: -1 });

        if (!ultimoMovimiento) {
          return {
            coordenada,
            tipo: ubi.tipo,
            nivel: ubi.nivel,
            capacidad: ubi.capacidad,
            sku: null,
            nombreProducto: null,
            cantidad: 0,
            estado: "Vacío",
            fechaVencimiento: null,
            fechaUltimoMov: null,
          };
        }

        // (Opcional) Buscar nombre del producto si tienes relación
        let nombreProducto = null;
        if (ultimoMovimiento.sku) {
          const prod = await Producto.findOne({ sku: ultimoMovimiento.sku });
          nombreProducto = prod?.nombre || "Producto desconocido";
        }

        const estado = ultimoMovimiento.cantidad >= ubi.capacidad
          ? "Lleno"
          : "Ocupado";

        return {
          coordenada,
          tipo: ubi.tipo,
          nivel: ubi.nivel,
          capacidad: ubi.capacidad,
          sku: ultimoMovimiento.sku,
          nombreProducto,
          cantidad: ultimoMovimiento.cantidad,
          estado,
          fechaVencimiento: ubi.fechaVencimiento || null, // <-- CAMBIO AQUÍ
          fechaUltimoMov: ultimoMovimiento.fecha || null,
        };
      })
    );

    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener layout", detalle: error.message });
  }
});

export default router;
