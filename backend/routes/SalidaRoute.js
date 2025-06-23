import express from "express";
import { registrarSalidaPorSKU } from "../controllers/SalidaController.js";

const router = express.Router();

router.post("/porSKU", registrarSalidaPorSKU);

export default router;