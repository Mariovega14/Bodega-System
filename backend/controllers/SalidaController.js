import Ubicacion from "../models/UbicacionModel.js";
import Movimiento from "../models/MovimientoModel.js";

export const registrarSalidaPorSKU = async (req, res) => {
    const { sku, tipoFEFO } = req.body;

    try {
        let ubicaciones = await Ubicacion.find({
            sku,
            fechaVencimiento: { $ne: null }
        });

        if (!ubicaciones || ubicaciones.length === 0) {
            return res.status(404).json({ error: "No hay stock disponible con ese SKU" });
        }

        // Estrategia de FEFO
        if (tipoFEFO === "primero") {
            ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
        } else if (tipoFEFO === "ultimo") {
            ubicaciones.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));
        } else if (tipoFEFO === "intermedio") {
            ubicaciones.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
            const mitad = Math.floor(ubicaciones.length / 2);
            ubicaciones = [ubicaciones[mitad]];
        }

        const seleccionada = ubicaciones[0];

        // Guardar SKU antes de limpiarlo
        const skuRetirado = seleccionada.sku;

        // Vaciar la ubicación
        seleccionada.sku = null;
        seleccionada.estado = "0";
        seleccionada.fechaMovimiento = new Date();
        seleccionada.fechaVencimiento = null;
        await seleccionada.save();

        // Registrar movimiento de salida
        await Movimiento.create({
            sku: skuRetirado,
            coordenada: seleccionada.coordenada,
            tipo: "Salida",
            fecha: new Date()
        });

        return res.status(200).json({
            mensaje: "Salida registrada correctamente",
            coordenada: seleccionada.coordenada
        });

    } catch (error) {
        console.error("Error al registrar salida:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};
