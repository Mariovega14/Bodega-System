import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  const rol = usuario?.rol;
  const nombreUsuario = usuario?.usuario;

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  if (!usuario) return null;

  const enlacesComunes = [{ ruta: "/", texto: "Inicio" }];

  const enlacesAdmin = [
    { ruta: "/ingresos", texto: "Ingresos" },
    { ruta: "/salidas", texto: "Salidas" },
    { ruta: "/layout", texto: "Layout" },
    { ruta: "/productos", texto: "Productos" },
    { ruta: "/movimientos", texto: "Movimientos" },
    { ruta: "/usuarios", texto: "Usuarios" },
    { ruta: "/ubicaciones", texto: "Ubicaciones" },
    // 🚫 Ya no agregamos "/registro" aquí
  ];

  const enlacesOperador = [
    { ruta: "/ingresos", texto: "Entradas" },
    { ruta: "/salidas", texto: "Salidas" },
  ];

  const enlaces = rol === "admin"
    ? [...enlacesComunes, ...enlacesAdmin]
    : rol === "operador"
      ? [...enlacesComunes, ...enlacesOperador]
      : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50 border-b-2 border-red-600">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-red-600 tracking-wider uppercase mr-4">
          Bodega System
        </h1>

        {/* Enlaces visibles */}
        <ul className="flex flex-wrap gap-2 sm:gap-4 items-center">
          {enlaces.map(({ ruta, texto }, index) => {
            const activo = location.pathname === ruta;
            return (
              <li key={index}>
                <Link
                  to={ruta}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 ${activo
                      ? "bg-red-600 text-white shadow-md"
                      : "text-white hover:bg-red-500 hover:text-white"
                    }`}
                >
                  {texto}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Menú del usuario (a la derecha) */}
        <div className="ml-auto relative mt-2 sm:mt-0" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-white text-sm font-semibold px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition"
          >
            👤 {nombreUsuario}
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-10 overflow-hidden">
              {rol === "admin" && (
                <Link
                  to="/registro"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuAbierto(false)}
                >
                  📝 Registrar Usuario
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
