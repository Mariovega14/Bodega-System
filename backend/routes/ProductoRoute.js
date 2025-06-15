import express from "express";
import Producto from "../models/ProductoModel.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = express.Router();

// 🔒 Ruta para registrar un nuevo producto (solo admin)
router.post("/", verificarRol("admin"), async (req, res) => {
  const { sku, nombre, tipo, centroCosto } = req.body;

  try {
    const productoExistente = await Producto.findOne({ sku });
    if (productoExistente) {
      return res.status(400).json({ error: "El producto ya existe" });
    }

    const nuevoProducto = new Producto({ sku, nombre, tipo, centroCosto });
    await nuevoProducto.save();

    res.status(201).json({
      mensaje: "Producto registrado exitosamente",
      producto: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al registrar el producto",
      detalle: error.message,
    });
  }
});

// 🔓 Ruta para obtener todos los productos (abierta)
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
