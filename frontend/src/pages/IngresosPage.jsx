import React, { useState } from "react";
import TablaIngresos from "../components/TablaIngresos";
import { enviarIngresos } from "../services/ingresosService";
import { toast } from "react-toastify";
import axios from "axios";

const IngresosPage = () => {
  const [filas, setFilas] = useState([
    { sku: "", fechaVencimiento: "", cantidad: 1 }
  ]);
  const [resultados, setResultados] = useState([]);

  const agregarFila = () => {
    setFilas([...filas, { sku: "", fechaVencimiento: "", cantidad: 1 }]);
  };

  const actualizarCelda = (index, campo, valor) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index][campo] = valor;
    setFilas(nuevasFilas);
  };

  const eliminarFila = (index) => {
    const nuevasFilas = [...filas];
    nuevasFilas.splice(index, 1);
    setFilas(nuevasFilas);
  };

  const manejarEnvio = async () => {
    const filasValidas = filas.filter(f => f.sku && f.fechaVencimiento && f.cantidad > 0);
    if (filasValidas.length === 0) {
      toast.error("No hay filas válidas para enviar");
      return;
    }

    try {
      console.log("🚀 Enviando al backend:", filasValidas);
const respuesta = await enviarIngresos(filasValidas);

      setResultados(respuesta.resultados);
      toast.success("Ingreso procesado");
    } catch (error) {
      toast.error("Error al enviar productos");
    }
  };

  const generarOrdenTrabajo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ordenes/generar",
        { resultados },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const nombreArchivo = `OrdenDeTrabajo_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.docx`;
      link.href = url;
      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Error al generar la Orden de Trabajo");
      console.error("Error ODT:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Ingreso de Productos</h1>

      <TablaIngresos
        filas={filas}
        actualizarCelda={actualizarCelda}
        eliminarFila={eliminarFila}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={agregarFila}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ➕ Agregar fila
        </button>
        <button
          onClick={manejarEnvio}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🚀 Ingresar productos
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Resultados:</h2>
          <ul className="space-y-1">
            {resultados.map((r, i) => (
              <li
                key={i}
                className={`p-2 rounded ${r.estado === "ok" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                SKU {r.sku}: {r.mensaje}
              </li>
            ))}
          </ul>

          {resultados.some(r => r.estado === "ok") && (
            <button
              onClick={generarOrdenTrabajo}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              📄 Generar Orden de Trabajo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default IngresosPage;
