import Ubicacion from "../models/UbicacionModel.js";

export const getAllUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find();

    const resultado = ubicaciones.map((ubi) => ({
      coordenada: `${ubi.pasillo}-${ubi.posicion}-${ubi.nivel}`,
      tipo: ubi.tipo,
      pasillo: ubi.pasillo,
      posicion: ubi.posicion,
      nivel: ubi.nivel,
      capacidad: ubi.capacidad,
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ubicaciones" });
  }
};
