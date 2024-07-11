const Producto = require('./models/products.model');
class ProductoDAO {
  async getAllProductos(filter = {}, limit = 10, page = 1, sort = '_id') {
      const totalDocuments = await Producto.countDocuments(filter);
      const totalPages = Math.ceil(totalDocuments / limit);

      const productos = await Producto.find(filter)
          .limit(limit)
          .skip((page - 1) * limit)
          .sort(sort)
          .lean();

      return {
          products: productos,
          totalPages: totalPages,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          page: page,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages
      };
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

module.exports = new ProductoDAO();