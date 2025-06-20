import { useEffect, useState } from "react";
import axios from "axios";

function ProductosPorVencer() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get("/api/dashboard/productos-por-vencer")
      .then(res => setDatos(res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  const diasRestantes = (fecha) => {
    const vencimiento = new Date(fecha);
    const hoy = new Date();
    const diff = vencimiento - hoy;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)); // días
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Productos por Vencer (próximos 15 días)</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">SKU</th>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Días restantes</th>
            <th className="px-4 py-2">Coordenada</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{item.sku}</td>
              <td className="border px-4 py-2">{item.nombreProducto}</td>
              <td className="border px-4 py-2">{diasRestantes(item.fechaVencimiento)} días</td>
              <td className="border px-4 py-2">{item.coordenada || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosPorVencer;
