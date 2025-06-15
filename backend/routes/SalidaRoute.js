import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Producto from "../models/ProductoModel.js";

const router = express.Router();

// 🔹 Buscar ubicaciones para salida según FEFO
router.post("/", async (req, res) => {
  const { sku, tipoFEFO, cantidadSolicitada } = req.body;

  try {
    // Validar existencia del producto
    const producto = await Producto.findOne({ sku });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar ubicaciones con el SKU y cantidad > 0
    let ubicaciones = await Ubicacion.find({ sku, cantidad: { $gt: 0 } });

    if (ubicaciones.length === 0) {
      return res.status(404).json({ error: "No hay stock disponible de este producto" });
    }

    // Ordenar ubicaciones según tipoFEFO
    if (tipoFEFO === "primero") {
      ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
    } else if (tipoFEFO === "ultimo") {
      ubicaciones.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
    } else if (tipoFEFO === "intermedio") {
      ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
      const mitad = Math.floor(ubicaciones.length / 2);
      ubicaciones = [ubicaciones[mitad]];
    }

    // Seleccionar ubicaciones necesarias para cumplir la cantidad solicitada
    let cantidadRestante = cantidadSolicitada;
    const salidas = [];

    for (const ubic of ubicaciones) {
      if (cantidadRestante <= 0) break;

      const retirar = Math.min(ubic.cantidad, cantidadRestante);

      salidas.push({
        coordenada: ubic.coordenada,
        fechaVencimiento: ubic.fechaVencimiento,
        cantidad: retirar,
      });

      cantidadRestante -= retirar;
    }

    if (cantidadRestante > 0) {
      return res.status(400).json({ error: "No hay suficiente stock para cubrir la cantidad solicitada" });
    }

    // Respuesta con ubicaciones sugeridas para salida
    res.json({ producto: producto.nombre, sku, salidas });

  } catch (error) {
    console.error("❌ Error en /api/salidas:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;
