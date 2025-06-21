import express from "express";
import Ubicacion from "../models/UbicacionModel.js";
import Producto from "../models/ProductoModel.js";
import Movimiento from "../models/MovimientoModel.js";
import { verificarRol } from "../middlewares/verificarRol.js";

const router = express.Router();

// 🔹 Registrar ingreso de producto a una ubicación
router.post("/", async (req, res) => {
  const { sku, coordenada } = req.body;

  try {
    const producto = await Producto.findOne({ sku });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const ubicacion = await Ubicacion.findOne({ coordenada });
    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    if (ubicacion.sku && ubicacion.sku !== sku) {
      return res.status(400).json({ error: "Ubicación ocupada por otro producto" });
    }

    if (ubicacion.cantidad === 1) {
      return res.status(400).json({ error: "Ubicación ya está llena" });
    }

    // Actualizar ubicación
    ubicacion.sku = sku;
    ubicacion.cantidad = 1;
    ubicacion.estado = "lleno";
    await ubicacion.save();

    // Registrar movimiento
    await Movimiento.create({
      sku,
      coordenada,
      tipo: "Ingreso"
    });

    res.status(200).json({ mensaje: "Ingreso registrado correctamente", ubicacion });

  } catch (error) {
    res.status(500).json({ error: "Error al registrar el ingreso", detalle: error.message });
  }
});

// 🔹 Retirar producto de una ubicación
router.post("/salida", async (req, res) => {
  const { coordenada } = req.body;

  try {
    const ubicacion = await Ubicacion.findOne({ coordenada });

    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }

    if (!ubicacion.sku || ubicacion.cantidad === 0) {
      return res.status(400).json({ error: "La ubicación ya está vacía" });
    }

    const skuRetirado = ubicacion.sku;

    // Vaciar la ubicación
    ubicacion.sku = null;
    ubicacion.cantidad = 0;
    ubicacion.estado = "vacío";
    await ubicacion.save();

    // Registrar movimiento
    await Movimiento.create({
      sku: skuRetirado,
      coordenada,
      tipo: "Salida"
    });

    res.status(200).json({ mensaje: "Salida registrada correctamente", ubicacion });

  } catch (error) {
    res.status(500).json({ error: "Error al registrar la salida", detalle: error.message });
  }
});

// 🔹 Ingreso automático protegido por rol
router.post("/automatico", verificarRol("admin", "operador"), async (req, res) => {
  const { sku } = req.body;

  try {
    const producto = await Producto.findOne({ sku });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar posición sugerida
    const posicionSugerida = producto.posicionSugerida; // debe existir en tu modelo
    if (!posicionSugerida) {
      return res.status(400).json({ error: "Producto no tiene una posición sugerida" });
    }

    const ubicacion = await Ubicacion.findOne({ coordenada: posicionSugerida });

    if (!ubicacion) {
      return res.status(404).json({ error: "Ubicación sugerida no existe" });
    }

    if (ubicacion.cantidad >= 1) {
      return res.status(400).json({ error: "La ubicación sugerida ya está llena" });
    }

    // Asignar producto
    ubicacion.sku = sku;
    ubicacion.cantidad = 1;
    ubicacion.estado = "lleno";
    await ubicacion.save();

    // Registrar movimiento
    await Movimiento.create({
      sku,
      coordenada: posicionSugerida,
      tipo: "Ingreso Automático"
    });

    res.status(200).json({ mensaje: "Ingreso automático registrado", ubicacion });

  } catch (error) {
    res.status(500).json({ error: "Error en ingreso automático", detalle: error.message });
  }
});

// 🔹 Listar todos los ingresos registrados
router.get("/", async (req, res) => {
  try {
    const ingresos = await Movimiento.find({ tipo: "Ingreso" }); // o "Ingreso Automático" si quieres ambos
    res.status(200).json(ingresos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ingresos", detalle: error.message });
  }
});

// 🔹 Ingreso por lote desde tabla (ingreso automático masivo)
router.post("/lote", async (req, res) => {
  const productos = req.body;
  const resultados = [];

  for (const producto of productos) {
    const { sku, fechaVencimiento, cantidad } = producto;

    try {
      const productoCatalogo = await Producto.findOne({ sku });
      if (!productoCatalogo) {
        resultados.push({ sku, estado: "error", mensaje: "SKU no encontrado en catálogo" });
        continue;
      }

      const posicionSugerida = productoCatalogo.posicionSugerida;
      if (!posicionSugerida) {
        resultados.push({ sku, estado: "error", mensaje: "Producto sin posición sugerida" });
        continue;
      }

      const partes = posicionSugerida.split("-");
      const pasilloOriginal = partes[0];
      let posicionNum = parseInt(partes[1]);
      const nivelInicial = parseInt(partes[2]);

      let ubicacion = null;

      // Intentar en misma posición, niveles superiores
      for (let nivel = nivelInicial; nivel <= 4; nivel++) {
        const coord = `${pasilloOriginal}-${posicionNum}-${nivel}`;
        const disponible = await Ubicacion.findOne({ coordenada: coord, sku: null });
        if (disponible) {
          ubicacion = disponible;
          break;
        }
      }

      // Si no encontró en misma posición, avanzar a siguientes posiciones del mismo pasillo
      if (!ubicacion) {
        for (let nuevaPos = posicionNum + 1; nuevaPos <= 50; nuevaPos++) {
          for (let nivel = 2; nivel <= 4; nivel++) {
            const coord = `${pasilloOriginal}-${nuevaPos}-${nivel}`;
            const disponible = await Ubicacion.findOne({ coordenada: coord, sku: null });
            if (disponible) {
              ubicacion = disponible;
              break;
            }
          }
          if (ubicacion) break;
        }
      }

      // Si no encontró en ese pasillo, buscar en otros pasillos
      if (!ubicacion) {
        const otrasUbicaciones = await Ubicacion.find({
          tipo: "ALMACENAMIENTO",
          sku: null
        }).sort({ pasillo: 1, posicion: 1, nivel: 1 });

        if (otrasUbicaciones.length > 0) {
          ubicacion = otrasUbicaciones.find(u => u.pasillo !== pasilloOriginal) || otrasUbicaciones[0];
        }
      }

      // Validación final
      if (!ubicacion || !ubicacion.coordenada) {
        resultados.push({ sku, estado: "error", mensaje: "No se encontró ubicación válida con coordenada" });
        continue;
      }


      ubicacion.sku = sku;
      ubicacion.fechaVencimiento = fechaVencimiento && fechaVencimiento !== "" ? new Date(fechaVencimiento) : null;
      ubicacion.fechaUltimoMov = new Date();
      ubicacion.cantidad = cantidad || 1;
      ubicacion.estado = "1";
      await ubicacion.save();

      // Log para ver cómo se guardó en MongoDB
      console.log("Ubicación guardada:", ubicacion);

      // Registrar movimiento
      await Movimiento.create({
        sku,
        coordenada: ubicacion.coordenada,
        tipo: "Ingreso Automático desde Tabla"
      });

      resultados.push({ sku, estado: "ok", mensaje: `Ingresado en ${ubicacion.coordenada}` });

    } catch (error) {
      resultados.push({ sku, estado: "error", mensaje: error.message });
    }
  }

  return res.status(200).json({ resultados });
});

export default router;
