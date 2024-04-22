const fs = require('fs').promises;
const path = require('path');

const cartPath = path.join(__dirname, 'carrito.json');

async function createCart(newCartData) {
  try {
    const data = await fs.readFile(cartPath, 'utf8');
    const carts = JSON.parse(data);
    
    //genera id
    const newCartId = generateUniqueId(carts);
    
    // crea lops item del carrito
    const newCart = {
      id: newCartId,
      products: newCartData.products || []
    };
    
    carts.push(newCart);
    
    await fs.writeFile(cartPath, JSON.stringify(carts, null, 2));
    
    return newCart;
  } catch (error) {
    throw new Error('Error creating cart: ' + error.message);
  }
}

async function getCartById(cartId) {
  try {
    const data = await fs.readFile(cartPath, 'utf8');
    const carts = JSON.parse(data);
    return carts.find(cart => cart.id === cartId);
  } catch (error) {
    throw new Error('Error fetching cart by ID: ' + error.message);
  }
}

async function addProductToCart(cartId, productId, quantity) {
  try {
    const data = await fs.readFile(cartPath, 'utf8');
    const carts = JSON.parse(data);
    
    // busca x id
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    // se fija q no se repitan los productos
    const existingProduct = cart.products.find(item => item.product === productId);
    if (existingProduct) {
      //si existe se suma a la cantidad y no se duplica
      existingProduct.quantity += quantity;
    } else {
      //si no existe agrega el producto
      cart.products.push({ product: productId, quantity });
    }
    
    await fs.writeFile(cartPath, JSON.stringify(carts, null, 2));
    
    return cart;
  } catch (error) {
    throw new Error('Error adding product to cart: ' + error.message);
  }
}

function generateUniqueId(carts) {
  // Generate unique ID
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
