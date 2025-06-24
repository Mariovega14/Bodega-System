import axios from "axios";

export const confirmarSalidaPorLote = async (lote) => {
  const response = await axios.post("/api/salidas/porLote", lote);
  return response.data;
};
