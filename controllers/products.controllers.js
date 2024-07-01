import ProductoDAO from '../dao/productsDAO.js';

const productoService = new ProductoDAO();

export const getAllProductos = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.send({ status: "success", productos });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const producto = await productoService.getProductoById(req.params.id);
    res.send({ status: "success", producto });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const createProducto = async (req, res) => {
  try {
    const producto = await productoService.createProducto(req.body);
    res.send({ status: "success", producto });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const producto = await productoService.updateProducto(req.params.id, req.body);
    res.send({ status: "success", producto });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    await productoService.deleteProducto(req.params.id);
    res.send({ status: "success", message: "Producto deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};
