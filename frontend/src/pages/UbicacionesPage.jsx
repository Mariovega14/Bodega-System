import React, { useEffect, useState } from "react";
import axios from "axios";
import CrearUbicacionModal from "../components/CrearUbicacionModal";

function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);

  const cargarUbicaciones = () => {
    axios
      .get("http://localhost:5000/api/ubicaciones")
      .then((res) => setUbicaciones(res.data))
      .catch((err) => console.error("Error al obtener ubicaciones:", err));
  };

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-red-700 tracking-wide">
          📍 Ubicaciones Registradas
        </h2>
        <CrearUbicacionModal onUbicacionCreada={cargarUbicaciones} />
      </div>

      <div className="overflow-x-auto rounded shadow-lg border border-gray-300 bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Coordenada</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Pasillo</th>
              <th className="px-6 py-3 text-left">Posición</th>
              <th className="px-6 py-3 text-left">Nivel</th>
              <th className="px-6 py-3 text-left">Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {ubicaciones.map((ubi, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-6 py-3">{ubi.coordenada}</td>
                <td className="px-6 py-3">{ubi.tipo}</td>
                <td className="px-6 py-3">{ubi.pasillo}</td>
                <td className="px-6 py-3">{ubi.posicion}</td>
                <td className="px-6 py-3">{ubi.nivel}</td>
                <td className="px-6 py-3">{ubi.capacidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UbicacionesPage;
