import axios from "axios";

const API_URL = "http://localhost:5000/api/ingresos/lote";

export const enviarIngresos = async (productos) => {
  try {
    const response = await axios.post(API_URL, productos);
    return response.data;
  } catch (error) {
    console.error("Error al enviar ingresos:", error);
    throw error;
  }
};
