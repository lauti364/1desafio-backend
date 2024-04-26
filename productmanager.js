const fs = require('fs').promises;
const path = require('path');

const productsPath = path.join(__dirname,   'data', 'productos.json');

async function getAllProducts(limit) {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    return limit ? products.slice(0, limit) : products;
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
}

async function getProductById(productId) {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    return products.find(product => product.id === productId);
  } catch (error) {
    throw new Error('Error fetching product by ID: ' + error.message);
  }
}

async function addProduct(newProductData) {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    const products = JSON.parse(data);

    // hace un id unico
    const newProductId = generateUniqueId(products);

    //hace el producto
    const newProduct = {
      id: newProductId,
      titulo: newProductData.titulo,
      descripcion: newProductData.descripcion,
      codigo: newProductData.codigo,
      precio: newProductData.precio,
      status: newProductData.status === undefined ? true : newProductData.status,
      stock: newProductData.stock,
      categoria: newProductData.categoria,
      thumbnails: newProductData.thumbnails || []
    };

    products.push(newProduct);

    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));

    return newProduct;
  } catch (error) {
    throw new Error('Error adding product: ' + error.message);
  }
}

async function updateProduct(productId, updatedProductData) {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    let products = JSON.parse(data);

    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    // actualiza el producto
    products[index] = { ...products[index], ...updatedProductData };

    // actuaiza el cambio en el json
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));

    return products[index];
  } catch (error) {
    throw new Error('Error updating product: ' + error.message);
  }
}

async function deleteProduct(productId) {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    let products = JSON.parse(data);
    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
      // Si el producto no existe, lanza un error indicando que el producto no fue encontrado
      throw new Error('Producto no encontrado');
    }

    // elimina el producto seleccionado
    const deletedProduct = products.splice(index, 1)[0];

    // actualiza la lista de productos sin el producto eliminado
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));

    // devuelve el producto elliminado
    return deletedProduct;
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
}

function generateUniqueId(products) {
  let newId = Math.floor(Math.random() * 1000) + 1;
  while (products.some(product => product.id === newId)) {
    newId = Math.floor(Math.random() * 1000) + 1;
  }
  return newId;
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
