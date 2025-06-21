import React, { useEffect, useState } from "react";
import axios from "axios";

function LayoutPage() {
  const [coordenadas, setCoordenadas] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/layout")
      .then((res) => setCoordenadas(res.data))
      .catch((err) => console.error("Error al obtener layout:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        🗺️ Layout - Estado de Ubicaciones
      </h1>

      <div className="overflow-x-auto shadow-lg border border-gray-300 rounded bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Coordenada</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Vencimiento</th>
              <th className="px-4 py-3 text-left">Últ. Movimiento</th>
            </tr>
          </thead>
          <tbody>
            {coordenadas.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2">{item.coordenada}</td>
                <td className="px-4 py-2">{item.tipo}</td>
                <td className="px-4 py-2">{item.sku || "-"}</td>
                <td className="px-4 py-2">{item.nombreProducto || "-"}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    item.estado === "Lleno"
                      ? "text-green-600"
                      : item.estado === "Ocupado"
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.estado}
                </td>
                <td className="px-4 py-2">
                  {item.fechaVencimiento
                    ? new Date(item.fechaVencimiento).toLocaleDateString(
                        "es-CL"
                      )
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {item.fechaUltimoMov
                    ? new Date(item.fechaUltimoMov).toLocaleString("es-CL", {
                        timeZone: "America/Santiago",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LayoutPage;
