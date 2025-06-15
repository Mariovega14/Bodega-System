// 📁 routes/UbicacionCargarRoute.js
import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = express.Router();

// 🔐 Ruta protegida solo para administradores
router.post("/cargar", verificarRol("admin"), async (req, res) => {
  try {
    const nuevasUbicaciones = [];

    for (let pasillo = 1; pasillo <= 5; pasillo++) {
      for (let posicion = 1; posicion <= 44; posicion++) {
        for (let nivel of [2, 3, 4]) {
          const coordenada = `P${pasillo}-${posicion}-${nivel}`;

          nuevasUbicaciones.push({
            coordenada,
            tipo: "ALMACENAMIENTO",
            estado: "Vacío",
            sku: null,
            capacidad: 1,
            cantidad: 0
          });
        }
      }
    }

    // 🗑️ Elimina todas las ubicaciones anteriores (si las hay)
    await Ubicacion.deleteMany({});

    // 💾 Inserta las nuevas
    await Ubicacion.insertMany(nuevasUbicaciones);

    res.status(201).json({ message: "Ubicaciones generadas exitosamente", total: nuevasUbicaciones.length });
  } catch (error) {
    console.error("Error al generar ubicaciones:", error);
    res.status(500).json({ error: "Error al generar ubicaciones" });
  }
});

export default router;
