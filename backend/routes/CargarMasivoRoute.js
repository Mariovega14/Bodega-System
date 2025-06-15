import express from "express";
import Ubicacion from "../models/UbicacionModel.js";

const router = express.Router();

// Ruta para cargar el pasillo P1 con 48 posiciones y niveles 2-4
router.post("/pasillo/p1", async (req, res) => {
  const nuevasUbicaciones = [];

  for (let posicion = 1; posicion <= 48; posicion++) {
    for (let nivel = 2; nivel <= 4; nivel++) {
      const coord = `P1-${posicion}-${nivel}`;
      nuevasUbicaciones.push({
        pasillo: "P1",
        posicion: posicion.toString(),
        nivel,
        tipo: "ALMACENAMIENTO",
        capacidad: 1,
        coordenada: coord, // ⚠️ NECESARIO porque es unique
      });
    }
  }

  try {
    const resultado = await Ubicacion.insertMany(nuevasUbicaciones, {
      ordered: false, // ⚠️ Ignora duplicados
    });

    res.status(201).json({
      mensaje: "Ubicaciones cargadas",
      total: resultado.length,
    });
  } catch (error) {
    res.status(200).json({
      mensaje: "Carga parcial o con duplicados",
      detalle: error.message,
    });
  }
});

export default router;
