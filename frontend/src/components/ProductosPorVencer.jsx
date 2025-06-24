import { useEffect, useState } from "react";
import axios from "axios";

function ProductosPorVencer() {
  const [datos, setDatos] = useState([]);
  const [dias, setDias] = useState(15);

  const fetchDatos = (rangoDias) => {
    axios
      .get(`/api/dashboard/productos-por-vencer?dias=${rangoDias}`)
      .then((res) => setDatos(res.data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchDatos(dias);
  }, [dias]);

  return (
    <div className="mt-0">
      {/* Header de sección */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Rango de días:</label>
          <select
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value={7}>7 días</option>
            <option value={15}>15 días</option>
            <option value={21}>21 días</option>
            <option value={30}>30 días</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-50 sticky top-0 z-10 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-left">Días restantes</th>
              <th className="px-6 py-3 text-left">Coordenada</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No hay productos con vencimiento en los próximos {dias} días.
                </td>
              </tr>
            ) : (
              [...datos]
                .sort((a, b) => a.diasRestantes - b.diasRestantes)
                .map((item, idx) => {
                  const urgencyColor =
                    item.diasRestantes <= 5
                      ? "bg-red-50"
                      : item.diasRestantes <= 10
                      ? "bg-yellow-50"
                      : "bg-green-50";

                  const textColor =
                    item.diasRestantes <= 5
                      ? "text-red-600"
                      : item.diasRestantes <= 10
                      ? "text-yellow-600"
                      : "text-green-600";

                  return (
                    <tr key={idx} className={`${urgencyColor} border-b`}>
                      <td className="px-6 py-3">{item.sku}</td>
                      <td className="px-6 py-3">{item.nombreProducto}</td>
                      <td className={`px-6 py-3 font-semibold ${textColor}`}>
                        {item.diasRestantes} días
                      </td>
                      <td className="px-6 py-3">{item.coordenada || "N/A"}</td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductosPorVencer;
