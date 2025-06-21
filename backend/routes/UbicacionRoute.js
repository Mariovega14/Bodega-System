// routes/UbicacionRoute.js
import express from "express";
import Ubicacion from "../models/UbicacionModel.js";

const router = express.Router();

// GET /api/ubicaciones
router.get("/", async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();
    const resultado = ubicaciones.map((ubi) => ({
      coordenada: `${ubi.pasillo}-${ubi.posicion}-${ubi.nivel}`,
      tipo: ubi.tipo,
      pasillo: ubi.pasillo,
      posicion: ubi.posicion,
      nivel: ubi.nivel,
      capacidad: ubi.capacidad
    }));

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ubicaciones
router.post("/", async (req, res) => {
  try {
    const { tipo, pasillo, posicion, nivel, capacidad } = req.body;

    if (!tipo || !pasillo || !posicion || nivel === undefined || capacidad === undefined) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const coordenada = `${pasillo}-${posicion}-${nivel}`;

    const nuevaUbicacion = new Ubicacion({
      coordenada,
      tipo,
      pasillo,
      posicion,
      nivel,
      capacidad,
      estado: "0",
      sku: null,
      fechaMovimiento: null,
      fechaVencimiento: null,
    });

    await nuevaUbicacion.save();

    res.status(201).json({
      mensaje: "Ubicación creada exitosamente",
      ubicacion: nuevaUbicacion,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.coordenada) {
      res.status(400).json({
        error: "Ya existe una ubicación con esa coordenada.",
      });
    } else {
      res.status(500).json({
        error: "Error al crear la ubicación.",
        detalle: error.message,
      });
    }
  }
});

export default router;