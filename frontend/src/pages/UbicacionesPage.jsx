import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/ubicaciones') // Ajusta si tu ruta es diferente
      .then(res => setUbicaciones(res.data))
      .catch(err => console.error('Error al obtener ubicaciones:', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Ubicaciones registradas</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Coordenada</th>
            <th className="border px-4 py-2">Tipo</th>
            <th className="border px-4 py-2">Pasillo</th>
            <th className="border px-4 py-2">Posición</th>
            <th className="border px-4 py-2">Nivel</th>
            <th className="border px-4 py-2">Capacidad</th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map((ubi, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{ubi.coordenada}</td>
              <td className="border px-4 py-2">{ubi.tipo}</td>
              <td className="border px-4 py-2">{ubi.pasillo}</td>
              <td className="border px-4 py-2">{ubi.posicion}</td>
              <td className="border px-4 py-2">{ubi.nivel}</td>
              <td className="border px-4 py-2">{ubi.capacidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UbicacionesPage;
