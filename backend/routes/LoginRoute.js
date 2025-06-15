import express from "express";
import { loginUsuario } from "../controllers/LoginController.js";

const router = express.Router();

router.post("/", loginUsuario);

export default router;
