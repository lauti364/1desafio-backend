const express = require('express');
const router = express.Router();
const {
    getAllCarts,getCartById,createCart,deleteCart,updateCart,updateCartProductQuantity,deleteCartProduct,populateCartProducts,
} = require('../controllers/carts.controllers');
const authorizeRole = require('../middleware/authorize');


// Obtiene todos los carritos
router.get('/carts', getAllCarts);

// Obtiene un carrito específico
router.get('/carts/:cid', getCartById);

// Crea un nuevo carrito
router.post('/carts', createCart);

// Borra un carrito
router.delete('/carts/:cid', deleteCart);

// Actualiza un carrito
router.put('/carts/:cid', updateCart);

// Modifica la cantidad de un producto en el carrito
router.put('/carts/:cid/products/:pid', updateCartProductQuantity);

// Elimina un producto específico del carrito
router.delete('/carts/:cid/products/:pid', authorizeRole('usuario'), deleteCartProduct);

// Obtiene todo usando populate
router.get('/carts/:cid/populate', populateCartProducts);



module.exports = router;
