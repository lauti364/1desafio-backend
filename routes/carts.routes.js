// routes/carts.routes.js

const express = require('express');
const router = express.Router();
const {
    getAllCarts,
    getCartById,
    createCart,
    deleteCart,
    updateCart,
    updateCartProductQuantity,
    deleteCartProduct,
    populateCartProducts,
    addProductToUserCart
} = require('../controllers/carts.controllers');
const authorizeRole = require('../middleware/authorize');

// Ruta para agregar un producto al carrito del usuario
router.post('/carts/{{user.cart}}/products/{{this._id}}', authorizeRole('usuario'), addProductToUserCart);


// Rutas de carritos
router.get('/carts', getAllCarts);
router.get('/carts/:cid', getCartById);
router.post('/carts', createCart);
router.delete('/carts/:cid', deleteCart);
router.put('/carts/:cid', updateCart);
router.put('/carts/:cid/products/:pid', updateCartProductQuantity);
router.delete('/carts/:cid/products/:pid', authorizeRole('usuario'), deleteCartProduct);
router.get('/carts/:cid/populate', populateCartProducts);

module.exports = router;
