import Movimiento from "../models/MovimientoModel.js";

async function registrarMovimiento({ sku, coordenada, tipo, origen, destino }) {
    const movimiento = new Movimiento({
        sku,
        coordenada,
        tipo, // "Ingreso" o "Salida"
        origen,
        destino,
        fecha: new Date(),
    });
    await movimiento.save();
}
export default registrarMovimiento;