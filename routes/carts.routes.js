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
    addProductToCart
} = require('../controllers/carts.controllers');
const authorizeRole  = require('../middleware/authorize')

// obtiene todos los carritos
router.get('/carts', getAllCarts);

// obtiene un carrito específico
router.get('/carts/:cid', getCartById);

// crea un nuevo carrito
router.post('/carts', createCart);

// borra el carrito
router.delete('/carts/:cid', deleteCart);

// actualiza el carrito
router.put('/carts/:cid', updateCart);

// modifica la cantidad del products en el cart
router.put('/carts/:cid/products/:pid', updateCartProductQuantity);

// elimina un producto especifico
router.delete('/carts/:cid/products/:pid', deleteCartProduct);


// obtiene todo usando populate
router.get('/carts/:cid/populate', populateCartProducts);

//agregar products x id
router.post('/carts/:cid/products/:productId', authorizeRole('usuario'), addProductToCart);

module.exports = router;
