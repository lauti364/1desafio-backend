import Producto from './models/products.model';

class ProductoDAO {
  async getAllProductos() {
    return await Producto.find();
  }

  async getProductoById(id) {
    return await Producto.findById(id);
  }

  async createProducto(productoData) {
    const producto = new Producto(productoData);
    return await producto.save();
  }

  async updateProducto(id, productoData) {
    return await Producto.findByIdAndUpdate(id, productoData, { new: true });
  }

  async deleteProducto(id) {
    return await Producto.findByIdAndDelete(id);
  }
}

export default ProductoDAO;