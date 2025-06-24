import Ubicacion from "../models/UbicacionModel.js";
import Movimiento from "../models/MovimientoModel.js";

export const registrarSalidasPorLote = async (req, res) => {
  const solicitudes = req.body;

  if (!Array.isArray(solicitudes)) {
    return res.status(400).json({ error: "El cuerpo debe ser un array de solicitudes" });
  }

  const resultados = [];

  try {
    for (const { sku, cantidad, tipoFEFO } of solicitudes) {
      let ubicaciones = await Ubicacion.find({
        sku,
        fechaVencimiento: { $ne: null }
      });

      if (!ubicaciones || ubicaciones.length === 0) {
        resultados.push({
          sku,
          mensaje: "Sin stock disponible",
          coordenadas: []
        });
        continue;
      }

      // Ordenar según estrategia FEFO
      if (tipoFEFO === "primero") {
        ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
      } else if (tipoFEFO === "ultimo") {
        ubicaciones.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
      } else if (tipoFEFO === "intermedio") {
        ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
        const mitad = Math.floor(ubicaciones.length / 2);
        ubicaciones = [ubicaciones[mitad]];
      }

      const coordenadas = [];

      for (let i = 0; i < cantidad && i < ubicaciones.length; i++) {
        const seleccionada = ubicaciones[i];
        const skuRetirado = seleccionada.sku;

        seleccionada.sku = null;
        seleccionada.estado = "0";
        seleccionada.fechaMovimiento = new Date();
        seleccionada.fechaVencimiento = null;
        await seleccionada.save();

        await Movimiento.create({
          sku: skuRetirado,
          coordenada: seleccionada.coordenada,
          tipo: "Salida",
          fecha: new Date()
        });

        coordenadas.push(seleccionada.coordenada);
      }

      resultados.push({
        sku,
        mensaje: `Se registraron ${coordenadas.length} salidas`,
        coordenadas
      });
    }

    return res.status(200).json(resultados);
  } catch (error) {
    console.error("Error procesando lote:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
