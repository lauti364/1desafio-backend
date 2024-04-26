
const fs = require('fs');
const path = require('path');

const CART_FILE_PATH = path.join(__dirname, '..', 'data', 'carrito.json');

//carga los fatos desde el json
function loadCartData() {
    try {
        const cartData = fs.readFileSync(CART_FILE_PATH, 'utf8');
        return JSON.parse(cartData);
    } catch (err) {
        // Si hay un error al leer el archivo, devuelve un objeto con un array vacío
        return { carts: [] };
    }
}

// guarda los datos del carrito en el Json
function saveCartData(cartData) {
    fs.writeFileSync(CART_FILE_PATH, JSON.stringify(cartData, null, 2), 'utf8');
}

// funciona un id unico
function generateCartId() {
    return Math.random().toString(36).substr(2, 9);
}

//crea un nuevo carrrito
function createCart() {
    const cartData = loadCartData();
    const newCart = {
        id: generateCartId(),
        products: []
    };
    cartData.carts.push(newCart);
    saveCartData(cartData);
    return newCart;
}

//busca el carrito x el id
function getCartById(cartId) {
    const cartData = loadCartData();
    return cartData.carts.find(cart => cart.id === cartId);
}

//agrega un producto al carrito
function addProductToCart(cartId, productId, quantity = 1) {
    const cartData = loadCartData();
    const cart = cartData.carts.find(cart => cart.id === cartId);
    if (!cart) {
        return { error: 'Carrito no encontrado' };
    }

    const existingProduct = cart.products.find(product => product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ id: productId, quantity });
    }

    saveCartData(cartData);
    return cart;
}

module.exports = { createCart, getCartById, addProductToCart };
