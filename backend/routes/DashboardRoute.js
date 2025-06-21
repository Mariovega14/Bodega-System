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
    // Agrupa por SKU y obtiene las ubicaciones únicas
    const stock = await Movimiento.aggregate([
      {
        $group: {
          _id: "$sku",
          coordenadas: { $addToSet: "$coordenada" }
        }
      },
      {
        $project: {
          _id: 1,
          coordenadas: 1,
          totalCantidad: { $size: "$coordenadas" } // <-- cuenta ubicaciones únicas
        }
      }
    ]);

    const resultado = await Promise.all(
      stock.map(async (item) => {
        const prod = await Producto.findOne({ sku: item._id });
        return {
          _id: item._id,
          nombreProducto: prod?.nombre || "Producto desconocido",
          totalCantidad: item.totalCantidad, // ahora es el número de ubicaciones
          coordenadas: item.coordenadas
        };
      })
    );

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener stock por producto", detalle: error.message });
  }
});

// 🕒 Productos por vencer en los próximos 15 días
router.get("/productos-por-vencer", async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 15);
    limite.setHours(23, 59, 59, 999);

    const resultados = await Layout.find({
      fechaVencimiento: {
        $gte: hoy,
        $lte: limite
      }
    }).select("sku nombreProducto fechaVencimiento coordenada");

    console.log("Resultados productos-por-vencer:", resultados); // <-- Agrega esto

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos por vencer" });
  }
});

export default router;