import React, { useEffect, useState } from "react";
import axios from "axios";
import CrearUbicacionModal from "../components/CrearUbicacionModal";

function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filtro, setFiltro] = useState('');

  const cargarUbicaciones = () => {
    axios
      .get("http://localhost:5000/api/ubicaciones")
      .then((res) => setUbicaciones(res.data))
      .catch((err) => console.error("Error al obtener ubicaciones:", err));
  };

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  const ubicacionesFiltradas = ubicaciones.filter((ubi) =>
    `${ubi.coordenada} ${ubi.tipo} ${ubi.pasillo}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📦 Ubicaciones registradas</h2>

      <CrearUbicacionModal onUbicacionCreada={cargarUbicaciones} />

      <div className="mt-6 mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="🔎 Filtrar por coordenada, pasillo o tipo..."
          className="px-4 py-2 border rounded w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded shadow-lg">
        <table className="min-w-full bg-white text-sm text-left text-gray-700">
          <thead className="bg-black text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Coordenada</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Pasillo</th>
              <th className="px-6 py-3">Posición</th>
              <th className="px-6 py-3">Nivel</th>
              <th className="px-6 py-3">Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {ubicacionesFiltradas.length > 0 ? (
              ubicacionesFiltradas.map((ubi, index) => (
                <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">{ubi.coordenada}</td>
                  <td className="px-6 py-4">{ubi.tipo}</td>
                  <td className="px-6 py-4">{ubi.pasillo}</td>
                  <td className="px-6 py-4">{ubi.posicion}</td>
                  <td className="px-6 py-4">{ubi.nivel}</td>
                  <td className="px-6 py-4">{ubi.capacidad}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">
                  No se encontraron ubicaciones que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UbicacionesPage;
