import React, { useState } from "react";
import TablaIngresos from "../components/TablaIngresos";
import { enviarIngresos } from "../services/ingresosService";
import { toast } from "react-toastify";
import axios from "axios";

const IngresosPage = () => {
  const [filas, setFilas] = useState([
    { sku: "", fechaVencimiento: "", cantidad: 1 },
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
    const filasValidas = filas.filter(
      (f) => f.sku && f.fechaVencimiento && f.cantidad > 0
    );
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
      const nombreArchivo = `OrdenDeTrabajo_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.docx`;
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        📦 Ingreso de Productos
      </h1>

      <div className="bg-white rounded shadow-md border border-gray-200 p-4 mb-6">
        <TablaIngresos
          filas={filas}
          actualizarCelda={actualizarCelda}
          eliminarFila={eliminarFila}
        />

        <div className="flex flex-wrap gap-4 mt-4 justify-end">
          <button
            onClick={agregarFila}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            ➕ Agregar fila
          </button>
          <button
            onClick={manejarEnvio}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            🚀 Ingresar productos
          </button>
        </div>
      </div>

      {resultados.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md border border-gray-200">
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            📋 Resultados:
          </h2>
          <ul className="space-y-2 text-sm">
            {resultados.map((r, i) => (
              <li
                key={i}
                className={`p-2 rounded border ${
                  r.estado === "ok"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                <strong>SKU {r.sku}</strong>: {r.mensaje}
              </li>
            ))}
          </ul>

          {resultados.some((r) => r.estado === "ok") && (
            <button
              onClick={generarOrdenTrabajo}
              className="mt-6 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded shadow"
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
