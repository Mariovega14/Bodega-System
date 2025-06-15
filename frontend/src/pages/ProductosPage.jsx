import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Lista de Productos</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Posición Sugerida</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">{prod.sku}</td>
              <td className="border px-4 py-2">{prod.nombre}</td>
              <td className="border px-4 py-2">{prod.posicionSugerida || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosPage;
