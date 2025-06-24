import { registrarSalidasPorLote } from "../controllers/SalidaController.js";
import express from "express";
const router = express.Router();

router.post("/porLote", registrarSalidasPorLote);

export default router;