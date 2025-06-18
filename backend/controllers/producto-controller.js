import Producto from "../models/ProductoModel.js";

export const cargarProductos = async (req, res) => {
  const productos = req.body.productos;

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res
      .status(400)
      .json({ mensaje: "Debes enviar un arreglo de productos" });
  }

  try {
    const result = await Producto.insertMany(productos, { ordered: false });
    res
      .status(201)
      .json({ mensaje: "Productos cargados", total: result.length });
  } catch (error) {
    res
      .status(200)
      .json({ mensaje: "Carga parcial con duplicados", error: error.message });
  }
};

export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find(); // trae todos
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};
