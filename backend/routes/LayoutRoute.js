import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Producto from "../models/ProductoModel.js";
import registrarMovimiento from "../utils/registrarMovimiento.js";

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

// req.body = { coordenadas: [ 'P1-1-1', 'P1-2-1' ] }
router.post("/salida-multiple", async (req, res) => {
  const { coordenadas } = req.body;

  try {
    const resultado = [];

    for (const coord of coordenadas) {
      const ubi = await Ubicacion.findOne({ coordenada: coord });
      if (!ubi) {
        resultado.push({ coordenada: coord, estado: "error", mensaje: "No encontrada" });
        continue;
      }

      ubi.sku = null;
      ubi.estado = "0";
      ubi.fechaVencimiento = null;
      ubi.fechaMovimiento = new Date();
      await ubi.save();

      await registrarMovimiento({
        sku: ubi.sku,
        coordenada: coord,
        tipo: "Salida"
      });

      resultado.push({ coordenada: coord, estado: "ok", mensaje: "Producto removido" });
    }

    res.json({ resultados: resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// req.body = { sku, coordenada, fechaVencimiento }
router.post("/agregar-manual", async (req, res) => {
  const { sku, coordenada, fechaVencimiento } = req.body;

  if (!sku || !coordenada) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  try {
    const ubicacion = await Ubicacion.findOne({ coordenada });

    if (!ubicacion) {
      return res.status(404).json({ mensaje: "Ubicación no encontrada" });
    }

    // Buscar producto
    const producto = await Producto.findOne({ sku });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (ubicacion.estado === "Ocupado") {
      return res.status(400).json({ mensaje: "La ubicación ya está ocupada" });
    }

    ubicacion.sku = sku;
    ubicacion.estado = "Ocupado";
    ubicacion.nombreProducto = producto.nombre;
    ubicacion.fechaUltimoMov = new Date();
    if (fechaVencimiento) {
      ubicacion.fechaVencimiento = new Date(fechaVencimiento);
    }

    await ubicacion.save();

    await registrarMovimiento({
      sku,
      coordenada,
      tipo: "Ingreso"
    });

    res.json({ mensaje: "Producto asignado a ubicación exitosamente" });
  } catch (error) {
    console.error("Error al agregar producto manual:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

export default router;
