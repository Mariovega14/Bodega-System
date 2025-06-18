import express from "express";
import {
  cargarProductos,
  listarProductos,
} from "../controllers/producto-controller.js";

const router = express.Router();

router.post("/pasillo1", cargarProductos);

router.get("/", listarProductos);

export default router;

// router.post("/pasillo1", async (req, res) => {
// const productosP1 = [
//   { sku: "423", nombre: "THREE PACK COCA-FTA X03 PET 3000 CC", posicionSugerida: "P1-9-2" },
//   { sku: "579", nombre: "Fanta Sin Azucar 3000", posicionSugerida: "P1-8-2" },
//   { sku: "1679", nombre: "Nordic G Ale Sin Azucar 3000", posicionSugerida: "P1-7-2" },
//   { sku: "354", nombre: "Coca Light 3000", posicionSugerida: "P1-6-2" },
//   { sku: "2009", nombre: "Inca Cola 3000", posicionSugerida: "P1-5-2" },
//   { sku: "497", nombre: "Multi 1 Coca SA Fta SA 3000", posicionSugerida: "P1-48-2" },
//   { sku: "498", nombre: "Multi 1 Coca SA Nord SA 3000", posicionSugerida: "P1-47-2" },
//   { sku: "499", nombre: "Multi 3 Coca SA Spte SA 3000", posicionSugerida: "P1-46-2" },
//   { sku: "2597", nombre: "Bened Piña Jengibre 2000", posicionSugerida: "P1-45-2" },
//   { sku: "2585", nombre: "Aquarius Manzana 1600", posicionSugerida: "P1-44-2" },
//   { sku: "2583", nombre: "Aquarius Limonada 1600", posicionSugerida: "P1-43-2" },
//   { sku: "567", nombre: "Fanta Red Az 3000", posicionSugerida: "P1-4-2" },
//   { sku: "2589", nombre: "Aquarius Uva 1600", posicionSugerida: "P1-40-2" },
//   { sku: "2586", nombre: "Aquarius Pera 1600", posicionSugerida: "P1-39-2" },
//   { sku: "2589", nombre: "Aquarius Uva 1600", posicionSugerida: "P1-38-2" },
//   { sku: "2586", nombre: "Aquarius Pera 1600", posicionSugerida: "P1-37-2" },
//   { sku: "2594", nombre: "Bened Pera 2000", posicionSugerida: "P1-36-2" },
//   { sku: "2592", nombre: "Bened Lim Jeng 2000", posicionSugerida: "P1-35-2" },
//   { sku: "2594", nombre: "Bened Pera 2000", posicionSugerida: "P1-34-2" },
//   { sku: "2592", nombre: "Bened Lim Jeng 2000", posicionSugerida: "P1-33-2" },
//   { sku: "2595", nombre: "Bened Pomelo Ment 2000", posicionSugerida: "P1-32-2" },
//   { sku: "2596", nombre: "Bened Frutilla 2000", posicionSugerida: "P1-31-2" },
//   { sku: "679", nombre: "Sprite Sin Azucar 3000", posicionSugerida: "P1-3-2" },
//   { sku: "2505", nombre: "Bened Sin Gas 2000", posicionSugerida: "P1-30-2" },
//   { sku: "2593", nombre: "Bened Manz 2000", posicionSugerida: "P1-29-2" },
//   { sku: "439", nombre: "MIXTO EXPORT MIXTO EXPORT 2.500CC", posicionSugerida: "P1-28-2" },
//   { sku: "438", nombre: "MIXTO EXPORT MIXTO EXPORT 2.500CC", posicionSugerida: "P1-26-2" },
//   { sku: "2506", nombre: "Bened Con Gas 2000", posicionSugerida: "P1-25-2" },
//   { sku: "343", nombre: "Coca Light 2500", posicionSugerida: "P1-24-2" },
//   { sku: "2245", nombre: "Vital Con Gas 2500", posicionSugerida: "P1-23-2" },
//   { sku: "378", nombre: "Coca Sin Azucar 2500", posicionSugerida: "P1-22-2" },
//   { sku: "2244", nombre: "Vital Sin Gas 2500", posicionSugerida: "P1-21-2" },
//   { sku: "2520", nombre: "Bened Sin Gas 3000", posicionSugerida: "P1-2-2" },
//   { sku: "1681", nombre: "Nordic Gin Ale 2500", posicionSugerida: "P1-20-2" },
//   { sku: "927", nombre: "Fanta Full Sugar 2500", posicionSugerida: "P1-19-2" },
//   { sku: "759", nombre: "Sprite Sprite 2500", posicionSugerida: "P1-18-2" },
//   { sku: "927", nombre: "Fanta Full Sugar 2500", posicionSugerida: "P1-17-2" },
//   { sku: "466", nombre: "Multi 2 Csa 1 Ft 3000", posicionSugerida: "P1-16-2" },
//   { sku: "143", nombre: "Coca Cola 2500", posicionSugerida: "P1-15-2" },
//   { sku: "465", nombre: "Multi 2 Csa 1 Sp 3000", posicionSugerida: "P1-14-2" },
//   { sku: "143", nombre: "Coca Cola 2500", posicionSugerida: "P1-13-2" },
//   { sku: "428", nombre: "Muti 2 Co 1 Sp 3000", posicionSugerida: "P1-12-2" },
//   { sku: "423", nombre: "Multi 2 Co 1 Fta 3000", posicionSugerida: "P1-11-2" },
//   { sku: "679", nombre: "Sprite Sin Azucar 3000", posicionSugerida: "P1-1-2" },
//   { sku: "428", nombre: "Multi 2 Co 1 Sp 3000", posicionSugerida: "P1-10-2" }
// ];

//   try {
//     const result = await Producto.insertMany(productosP1, { ordered: false });
//     res.status(201).json({ mensaje: "Productos cargados", total: result.length });
//   } catch (error) {
//     res.status(200).json({ mensaje: "Carga parcial con duplicados", error: error.message });
//   }
// });

// export default router;
