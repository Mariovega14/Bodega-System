import { useState } from "react";
import { confirmarSalidaPorLote } from "../services/salidasService";
import axios from "axios";

function SalidasPage() {
  const [items, setItems] = useState([
    { sku: "", cantidad: 1, tipoFEFO: "primero" },
  ]);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  const manejarCambio = (index, campo, valor) => {
    const copia = [...items];
    copia[index][campo] = campo === "cantidad" ? parseInt(valor) : valor;
    setItems(copia);
  };

  const agregarFila = () => {
    setItems([...items, { sku: "", cantidad: 1, tipoFEFO: "primero" }]);
  };

  const generarOrdenSalida = async () => {
    try {
      const response = await axios.post(
        "/api/ordenes/salida",
        { resultados },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      const nombreArchivo = `OrdenSalida_${new Date()
        .toISOString()
        .replace(/[:T]/g, "-")
        .slice(0, 19)}.docx`;
      link.href = url;
      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("❌ Error al generar orden de salida");
      console.error("Error Word:", error);
    }
  };

  const eliminarFila = (index) => {
    const copia = items.filter((_, idx) => idx !== index);
    setItems(copia);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);

    const confirmado = window.confirm("¿Deseas realizar estas salidas?");
    if (!confirmado) return;

    try {
      const data = await confirmarSalidaPorLote(items);
      setResultados(data);
      setItems([{ sku: "", cantidad: 1, tipoFEFO: "primero" }]);
    } catch (err) {
      setError(err.response?.data?.error || "Error inesperado");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        🚚 Salidas por Lote
      </h1>

      <form
        onSubmit={manejarEnvio}
        className="bg-white p-6 rounded shadow-md border border-gray-200 mb-8"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU:
              </label>
              <input
                type="text"
                value={item.sku}
                onChange={(e) => manejarCambio(idx, "sku", e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad:
              </label>
              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => manejarCambio(idx, "cantidad", e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo FEFO:
              </label>
              <select
                value={item.tipoFEFO}
                onChange={(e) => manejarCambio(idx, "tipoFEFO", e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded"
              >
                <option value="primero">Primero</option>
                <option value="intermedio">Intermedio</option>
                <option value="ultimo">Último</option>
              </select>
            </div>

            <div className="flex justify-end">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarFila(idx)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={agregarFila}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            ➕ Agregar SKU
          </button>
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded shadow"
          >
            ✅ Confirmar salidas
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-600 font-medium text-sm text-center mb-4">
          ❌ {error}
        </p>
      )}

      {resultados.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md border border-gray-200">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Resultados de las salidas
          </h2>
          <table className="w-full text-sm text-gray-800 border border-gray-300">
            <thead className="bg-black text-white text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Coordenadas</th>
                <th className="px-4 py-2 text-left">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{item.sku}</td>
                  <td className="px-4 py-2">
                    {item.coordenadas.length > 0
                      ? item.coordenadas.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-2">{item.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-right">
            <button
              onClick={generarOrdenSalida}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow"
            >
              📄 Generar Orden de Salida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalidasPage;
