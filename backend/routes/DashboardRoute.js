// routes/DashboardRoute.js
import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Producto from "../models/ProductoModel.js";
import Layout from "../models/LayoutModel.js";
import Movimiento from "../models/MovimientoModel.js";

const router = express.Router();

router.get("/estado-general", async (req, res) => {
  try {
    const total = await Ubicacion.countDocuments();

    const vacias = await Ubicacion.countDocuments({ sku: { $in: [null, ""] } });
    const ocupadas = total - vacias;

    res.json({
      total,
      vacias,
      ocupadas
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado general" });
  }
});

// Stock por producto con ubicaciones
router.get("/productos-cantidad", async (req, res) => {
  try {
    const stock = await Ubicacion.aggregate([
      {
        $match: { sku: { $ne: null } } // solo ubicaciones que tienen productos
      },
      {
        $group: {
          _id: "$sku",
          totalCantidad: { $sum: "$cantidad" },
          coordenadas: { $addToSet: "$coordenada" },
          ubicacionesTotales: { $sum: 1 } // ← cuenta documentos = ubicaciones
        }
      }
    ]);

    const resultado = await Promise.all(
      stock.map(async (item) => {
        const prod = await Producto.findOne({ sku: item._id });
        return {
          _id: item._id,
          nombreProducto: prod?.nombre || "Producto desconocido",
          totalCantidad: item.totalCantidad,
          totalUbicaciones: item.ubicacionesTotales,
          coordenadas: item.coordenadas
        };
      })
    );

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener stock por producto desde ubicaciones",
      detalle: error.message
    });
  }
});

// 🕒 Productos por vencer en los próximos 15 días
router.get("/productos-por-vencer", async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 15; // default: 15 días si no se especifica

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + dias);
    limite.setHours(23, 59, 59, 999);

    const ubicaciones = await Ubicacion.find({
      fechaVencimiento: { $gte: hoy, $lte: limite },
      sku: { $ne: null }
    });

    const resultados = await Promise.all(
      ubicaciones.map(async (ubi) => {
        const producto = await Producto.findOne({ sku: ubi.sku });

        const fechaVenc = new Date(ubi.fechaVencimiento);
        const diffMs = fechaVenc.getTime() - hoy.getTime();
        const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return {
          sku: ubi.sku,
          nombreProducto: producto?.nombre || "Producto desconocido",
          coordenada: ubi.coordenada || `${ubi.pasillo}-${ubi.posicion}-${ubi.nivel}`,
          fechaVencimiento: ubi.fechaVencimiento,
          diasRestantes
        };
      })
    );

    res.json(resultados);
  } catch (error) {
    console.error("Error productos-por-vencer:", error);
    res.status(500).json({ error: "Error al obtener productos por vencer" });
  }
});

export default router;