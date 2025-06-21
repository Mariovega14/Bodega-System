import { Link, useLocation } from "react-router-dom";

function Navbar({ rol }) {
  const location = useLocation();

  const enlacesComunes = [
    { ruta: "/", texto: "Inicio" },
    { ruta: "/productos", texto: "Productos" },
    { ruta: "/ubicaciones", texto: "Ubicaciones" },
    { ruta: "/layout", texto: "Layout" },
    { ruta: "/salidas", texto: "Salidas" },
  ];

  const enlacesAdmin = [
    { ruta: "/ingresos", texto: "Ingresos" },
    { ruta: "/movimientos", texto: "Movimientos" },
    { ruta: "/usuarios", texto: "Usuarios" },
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
    <nav className="bg-black shadow-md sticky top-0 z-50 border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-red-600 tracking-wider uppercase">
          Bodega System
        </h1>
        <ul className="flex flex-wrap gap-2 sm:gap-4">
          {enlaces.map((enlace, i) => {
            const activo = location.pathname === enlace.ruta;
            return (
              <li key={i}>
                <Link
                  to={enlace.ruta}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${
                    activo
                      ? "bg-red-600 text-white shadow-md"
                      : "text-white hover:bg-red-500 hover:text-white"
                  }`}
                >
                  {enlace.texto}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
