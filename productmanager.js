const fs = require('fs').promises;
const path = require('path');

const productsPath = path.join(__dirname, 'productos.json');

async function getAllProducts(limit) {
  const data = await fs.readFile(productsPath, 'utf8');
  const products = JSON.parse(data);
  return limit ? products.slice(0, limit) : products;
}

async function getProductById(productId) {
  const data = await fs.readFile(productsPath, 'utf8');
  const products = JSON.parse(data);
  return products.find(product => product.id === productId);
}

module.exports = {
  getAllProducts,
  getProductById
};
