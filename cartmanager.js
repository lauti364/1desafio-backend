const fs = require('fs').promises;
const path = require('path');

const cartsPath = path.join(__dirname, 'carritos.json');

async function createCart() {
  try {
    const cartsData = await fs.readFile(cartsPath, 'utf8');
    const carts = JSON.parse(cartsData);
    
    // genera id unico
    const newCartId = generateUniqueId(carts);

    // Crear el objeto del nuevo carrito
    const newCart = {
      id: newCartId,
      products: []
    };

    // ejecutra un array al carrito
    carts.push(newCart);

    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));

    return newCart;
  } catch (error) {
    throw new Error('Error creando carrito: ' + error.message);
  }
}

async function getCartById(cartId) {
  try {
    const cartsData = await fs.readFile(cartsPath, 'utf8');
    const carts = JSON.parse(cartsData);
    const cart = carts.find(cart => cart.id === cartId);
    return cart || null;
  } catch (error) {
    throw new Error('Error obteniendo carrito por ID: ' + error.message);
  }
}

async function addProductToCart(cartId, productId) {
  try {
    const cartsData = await fs.readFile(cartsPath, 'utf8');
    const carts = JSON.parse(cartsData);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const cart = carts[cartIndex];

    // verificacion de prodcuto
    const productIndex = cart.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      // si ya hay se suma
      cart.products[productIndex].quantity++;
    } else {
      //en caso de que no haya ese prodcuto en el carrito lo agrega
      cart.products.push({ id: productId, quantity: 1 });
    }

    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));

    return cart;
  } catch (error) {
    throw new Error('Error agregando producto al carrito: ' + error.message);
  }
}

function generateUniqueId(carts) {
  // genera un ID único
  let newId = Math.floor(Math.random() * 1000) + 1;
  while (carts.some(cart => cart.id === newId)) {
    newId = Math.floor(Math.random() * 1000) + 1;
  }
  return newId;
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart
};
