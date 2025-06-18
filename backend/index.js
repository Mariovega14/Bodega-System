import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
import ProductoRoute from "./routes/producto-routes.js";
import UbicacionRoute from "./routes/UbicacionRoute.js";
import IngresoRoute from "./routes/IngresoRoute.js";
import MovimientoRoute from "./routes/MovimientoRoute.js"; // ✅ ESTA
import UsuarioRoute from "./routes/UsuarioRoute.js";
import LoginRoute from "./routes/LoginRoute.js";
import IngresoAutomaticoRoute from "./routes/IngresoAutomaticoRoute.js";
import UbicacionCargarRoute from "./routes/UbicacionCargarRoute.js";
import LayoutRoute from "./routes/LayoutRoute.js";
import CargarMasivoRoute from "./routes/CargarMasivoRoute.js";
import OrdenTrabajoRoute from "./routes/OrdenTrabajoRoute.js";
import salidaRoutes from "./routes/SalidaRoute.js";

app.use("/api/ingresos/automatico", IngresoAutomaticoRoute);
app.use("/api/login", LoginRoute);
app.use("/api/usuarios", UsuarioRoute);
app.use("/api/productos", ProductoRoute);
app.use("/api/ubicaciones", UbicacionRoute);
app.use("/api/ingresos", IngresoRoute);
app.use("/api/movimientos", MovimientoRoute); // ✅ ESTA
app.use("/api/ubicaciones", UbicacionCargarRoute);
app.use("/api/layout", LayoutRoute);
app.use("/api/cargar", CargarMasivoRoute);
app.use("/api/ordenes", OrdenTrabajoRoute);
app.use("/api/salidas", salidaRoutes);
app.use;
app.get("/api/test", (req, res) => {
  res.json({ mensaje: "Funciona!" });
});
// Rutas de prueba
app.get("/", (req, res) => {
  res.send("🚚 Sistema de Gestión de Bodega funcionando!");
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    );
  })
  .catch((error) => console.error("❌ Error al conectar a MongoDB:", error));
