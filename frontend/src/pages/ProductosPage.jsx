import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    sku: "",
    nombre: "",
    posicionSugerida: "",
  });
  const [productosEnCola, setProductosEnCola] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const agregarProductoALaCola = () => {
    if (!nuevoProducto.sku || !nuevoProducto.nombre) return;
    setProductosEnCola([...productosEnCola, nuevoProducto]);
    setNuevoProducto({ sku: "", nombre: "", posicionSugerida: "" });
  };

  const enviarProductos = () => {
    axios
      .post("http://localhost:5000/api/productos/pasillo1", {
        productos: productosEnCola,
      })
      .then((res) => {
        setProductosEnCola([]);
        setModalOpen(false);
        return axios.get("http://localhost:5000/api/productos");
      })
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al crear productos:", err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Lista de Productos</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Crear Productos
        </button>
      </div>

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
              <td className="border px-4 py-2">
                {prod.posicionSugerida || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Agregar Productos</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="SKU"
                value={nuevoProducto.sku}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, sku: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Posición Sugerida"
                value={nuevoProducto.posicionSugerida}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    posicionSugerida: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={agregarProductoALaCola}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Añadir a la lista
              </button>
              <div>
                <h4 className="font-semibold mt-4">Productos en lista:</h4>
                <ul className="list-disc list-inside">
                  {productosEnCola.map((p, index) => (
                    <li key={index}>
                      {p.sku} - {p.nombre} ({p.posicionSugerida || "-"})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarProductos}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Crear Productos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosPage;
