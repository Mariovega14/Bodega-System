import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("/api/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      toast.error("Error al cargar usuarios");
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmado = window.confirm("¿Eliminar este usuario?");
    if (!confirmado) return;

    try {
      await axios.delete(`/api/usuarios/${id}`);
      toast.success("Usuario eliminado");
      cargarUsuarios(); // recarga la tabla
    } catch (err) {
      toast.error("No se pudo eliminar el usuario");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-red-700 mb-6 tracking-wide">
        👥 Gestión de Usuarios
      </h1>

      <div className="overflow-x-auto bg-white rounded shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-black text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.usuario}</td>
                <td className="px-4 py-2 capitalize">{u.rol}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => eliminarUsuario(u._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan="3">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosPage;

