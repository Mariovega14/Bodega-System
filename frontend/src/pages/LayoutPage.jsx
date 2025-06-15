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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Layout - Estado de Ubicaciones</h1>

      <table className="min-w-full border text-sm bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Coordenada</th>
            <th className="border px-3 py-2">Tipo</th>
            <th className="border px-3 py-2">SKU</th>
            <th className="border px-3 py-2">Producto</th>
            <th className="border px-3 py-2">Estado</th>
            <th className="border px-3 py-2">Vencimiento</th>
            <th className="border px-3 py-2">Último Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {coordenadas.map((item, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-1">{item.coordenada}</td>
              <td className="border px-2 py-1">{item.tipo}</td>
              <td className="border px-2 py-1">{item.sku || "-"}</td>
              <td className="border px-2 py-1">{item.nombreProducto || "-"}</td>
              <td className={`border px-2 py-1 font-semibold ${item.estado === "Lleno" ? "text-green-600" : item.estado === "Ocupado" ? "text-yellow-600" : "text-gray-500"}`}>
                {item.estado}
              </td>
              <td className="border px-2 py-1">
  {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString("es-CL") : "-"}
</td>
              <td className="border px-2 py-1">
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
  );
}

export default LayoutPage;
