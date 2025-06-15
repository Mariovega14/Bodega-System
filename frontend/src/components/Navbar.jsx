import { Link } from "react-router-dom";

function Navbar({ rol }) {
  const enlacesComunes = [
    { ruta: "/", texto: "Inicio" },
    { ruta: "/productos", texto: "Productos" },
    { ruta: "/ubicaciones", texto: "Ubicaciones" },
    { ruta: "/layout", texto: "Layout" },
    { ruta: "/salidas", texto: "Salidas" }, // ✅ NUEVO ENLACE COMÚN PARA ADMIN Y TRABAJADOR
  ];

  const enlacesAdmin = [
    { ruta: "/ingresos", texto: "Ingresos" },
    { ruta: "/movimientos", texto: "Movimientos" },
    { ruta: "/usuarios", texto: "Usuarios" },
    // { ruta: "/ingreso-automatico", texto: "Ingreso Automático" }, // ❌ Eliminado
  ];

  const enlacesTrabajador = [
    { ruta: "/ingresos", texto: "Ingresos" },
    { ruta: "/movimientos", texto: "Movimientos" },
  ];

  const enlaces =
    rol === "admin"
      ? [...enlacesComunes, ...enlacesAdmin]
      : rol === "trabajador"
      ? [...enlacesComunes, ...enlacesTrabajador]
      : [];

  if (enlaces.length === 0) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex flex-wrap space-x-4 text-sm">
        {enlaces.map((enlace, i) => (
          <li key={i}>
            <Link to={enlace.ruta} className="hover:underline">
              {enlace.texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
