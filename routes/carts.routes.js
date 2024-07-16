const express = require('express');
const router = express.Router();
const {
    getAllCarts,
    createCart,
    deleteCart,
    updateCart,
    populateCartProducts,
    addProductsToCart,
    purchaseCart,getCartById
} = require('../controllers/carts.controllers');
const authorizeRole = require('../middleware/authorize');

// agregar producto al caart del usuario
router.post('/carts/:cartId/add-product/:productId', authorizeRole(['usuario']), addProductsToCart);


//finañizar compra
router.get('/finalizarcompra', (req, res) => {
    res.render('cart-checkout', { title: 'finalizar compra' });
});

// Rutas de carritos
router.get('/carts', getAllCarts);
router.post('/carts', createCart);
router.delete('/carts/:cid', deleteCart);
router.put('/carts/:cid', updateCart);
router.get('/carts/:cid/populate', populateCartProducts);
router.post('/carts/:cid/purchase', purchaseCart);
router.get('/carts/:cid', getCartById);
module.exports = router;
