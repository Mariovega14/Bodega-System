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

export const eliminarProducto = async (req, res) => {
  const { sku } = req.params;

  if (!sku) {
    return res.status(400).json({ mensaje: "Falta el SKU del producto" });
  }

  try {
    const producto = await Producto.findOne({ sku });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Marcar como inactivo
    producto.activo = false;
    await producto.save();

    res.status(200).json({ mensaje: `Producto con SKU ${sku} fue desactivado correctamente` });
  } catch (error) {
    console.error("Error al desactivar producto:", error);
    res.status(500).json({ error: "Error al desactivar el producto" });
  }
};

