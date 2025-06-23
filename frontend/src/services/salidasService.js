import axios from "axios";

export const confirmarSalidaPorSKU = async (sku, tipoFEFO) => {
  const response = await axios.post("/api/salidas/porSKU", { sku, tipoFEFO });
  return response.data;
};
