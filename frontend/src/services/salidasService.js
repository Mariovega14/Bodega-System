import axios from "axios";

export const obtenerSalidasPorSKU = async (sku, tipoFEFO, cantidadSolicitada) => {
  try {
    const response = await axios.post("http://localhost:5000/api/salidas", {
      sku,
      tipoFEFO,
      cantidadSolicitada
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error al obtener las salidas";
  }
};
