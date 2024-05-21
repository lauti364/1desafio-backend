const mongoose = require('mongoose');
const Cart = require('../models/user.model'); 

// Función para crear un nuevo carrito
async function createCart() {
    try {
        const newCart = await Cart.create({ products: [] });
        return newCart;
    } catch (error) {
        throw new Error('No se pudo crear el carrito');
    }
}

// Función para buscar un carrito por su ID
async function getCartById(cartId) {
    try {
        const cart = await Cart.findById(cartId);
        return cart;
    } catch (error) {
        throw new Error('No se pudo encontrar el carrito');
    }
}

// Función para agregar un producto al carrito
async function addProductToCart(cartId, productId, quantity = 1) {
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return { error: 'Carrito no encontrado' };
        }

        const existingProductIndex = cart.products.findIndex(product => product.productId === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('No se pudo agregar el producto al carrito');
    }
}

module.exports = { createCart, getCartById, addProductToCart };
