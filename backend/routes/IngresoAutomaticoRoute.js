import express from "express";
import Producto from "../models/ProductoModel.js";
import Ubicacion from "../models/UbicacionModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { sku } = req.body;

  try {
    const producto = await Producto.findOne({ sku });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const posicionSugerida = producto.posicionSugerida;
    if (!posicionSugerida) {
      return res.status(400).json({ error: "Producto sin posición sugerida" });
    }

    // Verificar si la posición sugerida está disponible
    const disponible = await Ubicacion.findOne({
      coordenada: posicionSugerida,
      estado: 0
    });

    let coordenadaAsignada = null;

    if (disponible) {
      coordenadaAsignada = disponible.coordenada;
    } else {
      // Si no está disponible, buscar la más cercana
      const [pasilloBase, posicionBase, nivelBase] = posicionSugerida
        .split("-")
        .map((v, i) => (i === 1 || i === 2 ? parseInt(v) : v));

      const disponibles = await Ubicacion.find({ estado: 0 });

      const ordenadas = disponibles.sort((a, b) => {
        const [pa1, po1, ni1] = a.coordenada.split("-");
        const [pa2, po2, ni2] = b.coordenada.split("-");

        const dNivel = Math.abs(parseInt(ni1) - nivelBase) - Math.abs(parseInt(ni2) - nivelBase);
        if (dNivel !== 0) return dNivel;

        const dPos = Math.abs(parseInt(po1) - posicionBase) - Math.abs(parseInt(po2) - posicionBase);
        if (dPos !== 0) return dPos;

        return pa1.localeCompare(pa2);
      });

      if (ordenadas.length > 0) {
        coordenadaAsignada = ordenadas[0].coordenada;
      }
    }

    if (!coordenadaAsignada) {
      return res.status(409).json({ error: "No hay ubicaciones disponibles" });
    }

    // Actualizar la ubicación
    await Ubicacion.updateOne(
      { coordenada: coordenadaAsignada },
      {
        sku: producto.sku,
        estado: 1,
        fechaMovimiento: new Date()
      }
    );

    res.status(200).json({
      mensaje: "Producto ingresado correctamente",
      sku: producto.sku,
      coordenada: coordenadaAsignada
    });

  } catch (err) {
    console.error("Error en ingreso automático:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
