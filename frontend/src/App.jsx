import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductosPage from "./pages/ProductosPage";
import UbicacionesPage from "./pages/UbicacionesPage";
import IngresosPage from "./pages/IngresosPage";
import MovimientosPage from "./pages/MovimientosPage";
import UsuariosPage from "./pages/UsuariosPage";
import IngresoAutomaticoPage from "./pages/IngresoAutomaticoPage";
import LayoutPage from "./pages/LayoutPage";
import SalidasPage from "./pages/SalidasPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🧠 Subcomponente con acceso al contexto
function AppInner() {
  const { usuario } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* 📌 Pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🔐 Privadas comunes para admin y operador */}
        <Route
          path="/"
          element={
            <PrivateRoute roles={["admin", "operador"]}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/salidas"
          element={
            <PrivateRoute roles={["admin", "operador"]}>
              <SalidasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ingresos"
          element={
            <PrivateRoute roles={["admin", "operador"]}>
              <IngresosPage />
            </PrivateRoute>
          }
        />

        {/* 🔐 Solo admin */}
        <Route
          path="/productos"
          element={
            <PrivateRoute roles={["admin"]}>
              <ProductosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ubicaciones"
          element={
            <PrivateRoute roles={["admin"]}>
              <UbicacionesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/layout"
          element={
            <PrivateRoute roles={["admin"]}>
              <LayoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/movimientos"
          element={
            <PrivateRoute roles={["admin"]}>
              <MovimientosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute roles={["admin"]}>
              <UsuariosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/ingreso-automatico"
          element={
            <PrivateRoute roles={["admin"]}>
              <IngresoAutomaticoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PrivateRoute roles={["admin"]}>
              <RegisterPage />
            </PrivateRoute>
          }
        />

        {/* ❌ Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}

export default App;
