import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance"; // usa la instancia que agrega el token automáticamente
import { toast } from "react-toastify";

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    axios
      .get("/movimientos")
      .then((res) => setMovimientos(res.data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          toast.error("No autorizado. Inicia sesión nuevamente.");
        } else {
          toast.error("Error al obtener movimientos");
        }
      });
  }, []);

  const generarWord = async (id) => {
    try {
      const res = await axios.get(`/movimientos/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Movimiento_${id}.docx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error("No se pudo generar el documento");
    }
  };

  const movimientosFiltrados = movimientos.filter((mov) => {
    const texto = `${mov.sku} ${mov.coordenada}`.toLowerCase();
    const matchBusqueda = texto.includes(busqueda.toLowerCase());

    const fechaObj = new Date(mov.fecha);
    const fechaMovimiento = fechaObj.getFullYear() + "-" +
      String(fechaObj.getMonth() + 1).padStart(2, "0") + "-" +
      String(fechaObj.getDate()).padStart(2, "0");
    const dentroDeRango =
      (!fechaInicio || fechaMovimiento >= fechaInicio) &&
      (!fechaFin || fechaMovimiento <= fechaFin);

    return matchBusqueda && dentroDeRango;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        🔢 Historial de Movimientos
      </h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded shadow-md border border-gray-300 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por SKU o coordenada"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Coordenada</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((mov) => (
              <tr key={mov._id} className="border-t">
                <td className="px-4 py-2">{mov.sku || "-"}</td>
                <td className="px-4 py-2">{mov.coordenada}</td>
                <td className="px-4 py-2 capitalize">{mov.tipo}</td>
                <td className="px-4 py-2">
                  {new Date(mov.fecha).toLocaleString("es-CL")}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => generarWord(mov._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    📄 Word
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovimientosPage;