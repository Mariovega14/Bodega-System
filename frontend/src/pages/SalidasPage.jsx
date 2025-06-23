import { useState } from "react";
import { confirmarSalidaPorSKU } from "../services/salidasService";

function SalidasPage() {
  const [sku, setSku] = useState("");
  const [tipoFEFO, setTipoFEFO] = useState("primero");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  const manejarSalida = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);

    const confirmado = window.confirm("¿Estás seguro de realizar esta salida?");
    if (!confirmado) return;

    try {
      const data = await confirmarSalidaPorSKU(sku, tipoFEFO);
      setResultados([
        {
          coordenada: data.coordenada,
          fechaVencimiento: data.fechaVencimiento,
          cantidadRetirada: 1,
        },
      ]);
      setSku("");
    } catch (err) {
      setError(err.response?.data?.error || "Error inesperado");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        🚚 Salidas de Producto
      </h1>

      <form
        onSubmit={manejarSalida}
        className="bg-white p-6 rounded shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU:</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo FEFO:</label>
          <select
            value={tipoFEFO}
            onChange={(e) => setTipoFEFO(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="primero">Primero en expirar</option>
            <option value="intermedio">Intermedio</option>
            <option value="ultimo">Último en expirar</option>
          </select>
        </div>

        <div className="md:col-span-3 flex justify-end pt-2">
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded shadow"
          >
            ✅ Confirmar salida
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
            Salida realizada exitosamente
          </h2>
          <table className="w-full text-sm text-gray-800 border border-gray-300">
            <thead className="bg-black text-white uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Coordenada</th>
                <th className="px-4 py-2 text-left">Vencimiento</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{item.coordenada}</td>
                  <td className="px-4 py-2">
                    {item.fechaVencimiento
                      ? new Date(item.fechaVencimiento).toLocaleDateString("es-CL")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">{item.cantidadRetirada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalidasPage;
