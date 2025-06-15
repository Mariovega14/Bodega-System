import React from "react";

const TablaIngresos = ({ filas, actualizarCelda, eliminarFila }) => {
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">SKU</th>
          <th className="border px-4 py-2">Fecha Vencimiento</th>
          <th className="border px-4 py-2">Cantidad</th>
          <th className="border px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, index) => (
          <tr key={index} className="text-center">
            {/* SKU */}
            <td className="border px-2 py-1">
              <input
                type="text"
                className="w-full p-1 border rounded"
                value={fila.sku}
                onChange={(e) => actualizarCelda(index, "sku", e.target.value)}
              />
            </td>

            {/* Fecha Vencimiento */}
            <td className="border px-2 py-1">
              <input
                type="date"
                className="w-full p-1 border rounded"
                value={fila.fechaVencimiento}
                onChange={(e) => actualizarCelda(index, "fechaVencimiento", e.target.value)}
              />
            </td>

            {/* Cantidad */}
            <td className="border px-2 py-1">
              <input
                type="number"
                min="1"
                className="w-full p-1 border rounded"
                value={fila.cantidad}
                onChange={(e) => actualizarCelda(index, "cantidad", parseInt(e.target.value))}
              />
            </td>

            {/* Eliminar fila */}
            <td className="border px-2 py-1">
              <button
                onClick={() => eliminarFila(index)}
                className="text-red-600 hover:underline"
              >
                ❌ Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaIngresos;
