import express from "express";
import Ubicacion from "../models/UbicacionModel.js";

const router = express.Router();

// 🔹 Obtener todas las ubicaciones (solo estructura física)
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

// 🔹 Crear nueva ubicación
router.post("/", async (req, res) => {
  try {
    const nuevaUbicacion = new Ubicacion(req.body);
    await nuevaUbicacion.save();
    res.status(201).json(nuevaUbicacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

// 🟩 Obtener ubicaciones vacías (estado = 0)
router.get("/vacias", async (req, res) => {
  try {
    const vacias = await Ubicacion.find({ estado: 0 });
    res.json(vacias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ubicaciones vacías", detalle: error.message });
  }
});
