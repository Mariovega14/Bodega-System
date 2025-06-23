import express from "express";
import Movimiento from "../models/MovimientoModel.js";
import { generarWordMovimiento } from "../utils/generarWordMovimiento.js";
import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = express.Router();

// 🔒 Obtener todos los movimientos (solo admin)
router.get("/", verificarToken, verificarRol("admin"), async (req, res) => {
  try {
    const movimientos = await Movimiento.find().sort({ fecha: -1 });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los movimientos",
      detalle: error.message,
    });
  }
});

// 🔒 Filtrar movimientos por tipo (solo admin)
router.get("/tipo/:tipo", verificarToken, verificarRol("admin"), async (req, res) => {
  const { tipo } = req.params;

  try {
    if (tipo !== "ingreso" && tipo !== "salida") {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Debe ser "ingreso" o "salida"' });
    }

    const movimientos = await Movimiento.find({ tipo }).sort({ fecha: -1 });
    res.status(200).json(movimientos);
  } catch (error) {
    res.status(500).json({
      error: "Error al filtrar los movimientos",
      detalle: error.message,
    });
  }
});

// 🔒 Generar Word de un movimiento específico (solo admin)
router.get("/:id/download", verificarToken, verificarRol("admin"), async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id);
    if (!movimiento) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    const buffer = await generarWordMovimiento(movimiento);

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=Movimiento_${movimiento._id}.docx`,
    });

    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      error: "Error al generar el documento",
      detalle: error.message,
    });
  }
});

export default router;
