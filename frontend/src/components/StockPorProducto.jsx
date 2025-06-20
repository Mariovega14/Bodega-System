import { useEffect, useState } from "react";
import axios from "axios";

function StockPorProducto() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get("/api/dashboard/productos-cantidad")
      .then(res => setDatos(res.data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Stock por Producto</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">SKU</th>
            <th className="px-4 py-2">Producto</th>
            <th className="px-4 py-2">Cantidad Total</th>
            <th className="px-4 py-2">Ubicaciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{item._id}</td>
              <td className="border px-4 py-2">{item.nombreProducto}</td>
              <td className="border px-4 py-2">{item.totalCantidad}</td>
              <td className="border px-4 py-2 text-sm">{item.coordenadas.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockPorProducto;
