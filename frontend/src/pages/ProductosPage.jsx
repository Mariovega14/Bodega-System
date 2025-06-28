import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    sku: "",
    nombre: "",
    posicionSugerida: "",
  });
  const [productosEnCola, setProductosEnCola] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/productos")
      .then((res) => {
        const activos = res.data.filter((p) => p.activo !== false); // Mostrar solo activos
        setProductos(activos);
      })
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
      .then(() => {
        setProductosEnCola([]);
        setModalOpen(false);
        return axios.get("http://localhost:5000/api/productos");
      })
      .then((res) => {
        const activos = res.data.filter((p) => p.activo !== false);
        setProductos(activos);
      })
      .catch((err) => console.error("Error al crear productos:", err));
  };

  const eliminarProducto = (sku) => {
    Swal.fire({
      title: `¿Eliminar SKU ${sku}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/productos/${sku}`)
          .then(() => {
            return axios.get("http://localhost:5000/api/productos");
          })
          .then((res) => {
            const activos = res.data.filter((p) => p.activo !== false);
            setProductos(activos);
            Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
          })
          .catch(() => {
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
          });
      }
    });
  };

  const productosFiltrados = productos.filter((prod) =>
    `${prod.sku} ${prod.nombre}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-red-700 tracking-wide">
          📦 Productos
        </h2>
        <input
          type="text"
          placeholder="🔍 Buscar por SKU o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="ml-4 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600 w-72"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded shadow-md"
        >
          + Crear Productos
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow-lg border border-gray-300 bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white uppercase tracking-wide text-xs">
            <tr>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Posición sugerida</th>
              <th className="px-6 py-3 text-left">Acciones</th> {/* Nueva columna */}
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="px-6 py-3">{prod.sku}</td>
                <td className="px-6 py-3">{prod.nombre}</td>
                <td className="px-6 py-3">{prod.posicionSugerida || "-"}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => eliminarProducto(prod.sku)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl border border-gray-300">
            <h3 className="text-2xl font-bold text-black mb-6">
              ➕ Agregar nuevo producto
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="SKU"
                value={nuevoProducto.sku}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, sku: e.target.value })
                }
                className="w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoProducto.nombre}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                }
                className="w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
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
                className="w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <button
                onClick={agregarProductoALaCola}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded w-full"
              >
                + Añadir a la lista
              </button>

              <div>
                <h4 className="text-sm font-semibold mb-1 text-gray-700">
                  Productos en lista:
                </h4>
                <ul className="text-sm text-gray-800 list-disc list-inside">
                  {productosEnCola.map((p, index) => (
                    <li key={index}>
                      {p.sku} - {p.nombre} ({p.posicionSugerida || "-"})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarProductos}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
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