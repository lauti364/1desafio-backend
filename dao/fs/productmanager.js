const Producto = require('./models/user.model');
// Obtener todos los productos
async function getAllProduct(limit) {
  try {
    let products;
    if (limit) {
      products = await Producto.find().limit(limit);
    } else {
      products = await Producto.find();
    }
    return products;
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
}

// Obtener un producto por su ID
async function getProductById(productId) {
  try {
    const product = await Producto.findById(productId);
    return product;
  } catch (error) {
    throw new Error('Error fetching product by ID: ' + error.message);
  }
}

// Agregar un nuevo producto
async function addProduct(newProductData) {
  try {
    const newProduct = await Producto.create(newProductData);
    return newProduct;
  } catch (error) {
    throw new Error('Error adding product: ' + error.message);
  }
}

// Actualizar un producto por su ID
async function updateProduct(productId, updatedProductData) {
  try {
    const updatedProduct = await Producto.findByIdAndUpdate(productId, updatedProductData, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error('Error updating product: ' + error.message);
  }
}

// Eliminar un producto por su ID
async function deleteProduct(productId) {
  try {
    const deletedProduct = await Producto.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
}

module.exports = {
  getAllProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};

