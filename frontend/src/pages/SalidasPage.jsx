import { useState } from "react";
import { obtenerSalidasPorSKU } from "../services/salidasService";

function SalidasPage() {
  const [sku, setSku] = useState("");
  const [tipoFEFO, setTipoFEFO] = useState("primero");
  const [cantidad, setCantidad] = useState(1);
  const [resultados, setResultados] = useState([]);
  const [producto, setProducto] = useState("");
  const [error, setError] = useState("");

  const manejarBusqueda = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);
    try {
      const data = await obtenerSalidasPorSKU(sku, tipoFEFO, cantidad);
      setResultados(data.salidas);
      setProducto(data.producto);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Salidas de Producto</h1>

      <form onSubmit={manejarBusqueda} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium">SKU:</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de FEFO:</label>
          <select
            value={tipoFEFO}
            onChange={(e) => setTipoFEFO(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="primero">Primero en expirar</option>
            <option value="intermedio">Intermedio</option>
            <option value="ultimo">Último en expirar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Cantidad a retirar:</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar salidas
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {resultados.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Resultados para: {producto} ({sku})
          </h2>
          <table className="w-full border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-1">Coordenada</th>
                <th className="border px-3 py-1">Fecha de Vencimiento</th>
                <th className="border px-3 py-1">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-3 py-1">{item.coordenada}</td>
                  <td className="border px-3 py-1">
                    {new Date(item.fechaVencimiento).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-1">{item.cantidad}</td>
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
