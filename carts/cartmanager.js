let carts = [];

// Función para generar un ID único para los carritos
function generateCartId() {
    return Math.random().toString(36).substr(2, 9);
}

// Función para crear un nuevo carrito
function createCart() {
    const newCart = {
        id: generateCartId(),
        products: []
    };
    carts.push(newCart);
    return newCart;
}

// Función para obtener un carrito por su ID
function getCartById(cartId) {
    return carts.find(cart => cart.id === cartId);
}

// Función para agregar un producto al carrito
function addProductToCart(cartId, productId, quantity = 1) {
    const cart = getCartById(cartId);
    if (!cart) {
        return { error: 'Cart not found' };
    }

    const existingProduct = cart.products.find(product => product.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ id: productId, quantity });
    }
    return cart;
}

module.exports = { createCart, getCartById, addProductToCart };