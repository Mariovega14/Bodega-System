import { useEffect, useState } from "react";
import axios from "axios";

function StockPorProducto() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios
      .get("/api/dashboard/productos-cantidad")
      .then((res) => setDatos(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="mt-0">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-left"># Ubicaciones</th>
              <th className="px-6 py-3 text-left">Coordenadas</th>
            </tr>
          </thead>
          <tbody>
            {datos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No hay datos disponibles de stock.
                </td>
              </tr>
            ) : (
              datos.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-3 font-semibold">{item._id || "-"}</td>
                  <td className="px-6 py-3">{item.nombreProducto || "Producto desconocido"}</td>
                  <td className="px-6 py-3 text-blue-700 font-medium">
                    {item.totalUbicaciones ?? item.coordenadas?.length ?? 0}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {Array.isArray(item.coordenadas) && item.coordenadas.length > 0
                      ? item.coordenadas.join(", ")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockPorProducto;
