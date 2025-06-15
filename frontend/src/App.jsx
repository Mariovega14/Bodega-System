import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import ProductosPage from "./pages/ProductosPage";
import UbicacionesPage from "./pages/UbicacionesPage";
import IngresosPage from "./pages/IngresosPage";
import MovimientosPage from "./pages/MovimientosPage";
import UsuariosPage from "./pages/UsuariosPage";
import IngresoAutomaticoPage from "./pages/IngresoAutomaticoPage";
import LayoutPage from "./pages/LayoutPage";
import SalidasPage from "./pages/SalidasPage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [rolUsuario, setRolUsuario] = useState(() => {
    return localStorage.getItem("rolUsuario") || "admin";
  });

  useEffect(() => {
    localStorage.setItem("rolUsuario", rolUsuario);
  }, [rolUsuario]);

  return (
    <Router>
      {/* Selector de rol (solo visible en desarrollo) */}
      <div className="bg-gray-100 p-2 flex items-center justify-between">
        <div>
          <label className="mr-2 font-semibold">Rol actual:</label>
          <select
            value={rolUsuario}
            onChange={(e) => setRolUsuario(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="admin">Admin</option>
            <option value="trabajador">Trabajador</option>
          </select>
        </div>
      </div>

      <Navbar rol={rolUsuario} />

      <Routes>
        {/* Accesibles para todos */}
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/ubicaciones" element={<UbicacionesPage />} />
        <Route path="/layout" element={<LayoutPage />} />
        <Route path="/salidas" element={<SalidasPage />} />

        {/* Solo trabajador */}
        {rolUsuario === "trabajador" && (
          <>
            <Route path="/ingresos" element={<IngresosPage />} />
            <Route path="/movimientos" element={<MovimientosPage />} />
          </>
        )}

        {/* Solo admin */}
        {rolUsuario === "admin" && (
          <>
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/ingreso-automatico" element={<IngresoAutomaticoPage />} />
            <Route path="/ingresos" element={<IngresosPage />} />
            <Route path="/movimientos" element={<MovimientosPage />} />
          </>
        )}

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
