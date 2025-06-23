import Ubicacion from "../models/UbicacionModel.js";

export const registrarSalidaPorSKU = async (req, res) => {
    const { sku, tipoFEFO } = req.body;

    try {
        // 🔎 Buscar ubicaciones con el SKU y una fecha de vencimiento válida
        let ubicaciones = await Ubicacion.find({
            sku,
            fechaVencimiento: { $ne: null }
        });

        // ❌ Si no hay coincidencias, enviar error
        if (!ubicaciones || ubicaciones.length === 0) {
            return res
                .status(404)
                .json({ error: "No hay stock disponible con ese SKU" });
        }

        // 🔄 Ordenar según la estrategia FEFO seleccionada
        if (tipoFEFO === "primero") {
            ubicaciones.sort(
                (a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
            );
        } else if (tipoFEFO === "ultimo") {
            ubicaciones.sort(
                (a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento)
            );
        } else if (tipoFEFO === "intermedio") {
            ubicaciones.sort(
                (a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento)
            );
            const mitad = Math.floor(ubicaciones.length / 2);
            ubicaciones = [ubicaciones[mitad]];
        }

        // ✅ Tomamos la ubicación seleccionada
        const seleccionada = ubicaciones[0];

        // 🧹 Limpiar los datos para simular una salida
        seleccionada.sku = null;
        seleccionada.estado = 0;
        seleccionada.fechaMovimiento = null;
        seleccionada.fechaVencimiento = null;

        await seleccionada.save();

        // 📤 Respuesta
        return res.status(200).json({
            mensaje: "Salida registrada correctamente",
            coordenada: seleccionada.coordenada
        });
    } catch (error) {
        console.error("Error al registrar salida:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};
