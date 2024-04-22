const fs = require('fs').promises;
const path = require('path');

const productsPath = path.join(__dirname, 'productos.json');

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

    // Generar un nuevo ID
    const newProductId = generateUniqueId(products);

    // Crear el objeto del nuevo producto
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

    // Agregar el nuevo producto al array
    products.push(newProduct);

    // Escribir el array de productos actualizado en el archivo
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

    // Buscar el índice del producto a actualizar
    const index = products.findIndex(product => product.id === productId);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    // Actualizar el producto con los datos proporcionados
    products[index] = { ...products[index], ...updatedProductData };

    // Escribir el array de productos actualizado en el archivo
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

    // Filtrar el array de productos para excluir el producto con el ID proporcionado
    products = products.filter(product => product.id !== productId);

    // Escribir el array de productos actualizado en el archivo
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
}

function generateUniqueId(products) {
  // Generar un ID único
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
