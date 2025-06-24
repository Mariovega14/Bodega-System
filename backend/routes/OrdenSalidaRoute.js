import express from "express";
import { generarOrdenSalida } from "../controllers/OrdenSalidaController.js";

const router = express.Router();

router.post("/salida", generarOrdenSalida);

export default router;