const express = require('express');
const router = express.Router();
const {
    getAllCarts,
    getCartById,
    createCart,
    deleteCart,
    updateCart,
    populateCartProducts,
    addProductsToCart,
    purchaseCart
} = require('../controllers/carts.controllers');
const authorizeRole = require('../middleware/authorize');

// agregar producto al caart del usuario(pendiente)
router.post('/carts/:cartId/add-product/:productId', addProductsToCart);


//finañizar compra
router.get('/finalizarcompra', (req, res) => {
    res.render('cart-checkout', { title: 'finalizar compra' });
});

// Rutas de carritos
router.get('/carts', getAllCarts);
router.get('/carts/:cid', getCartById);
router.post('/carts', createCart);
router.delete('/carts/:cid', deleteCart);
router.put('/carts/:cid', updateCart);
router.get('/carts/:cid/populate', populateCartProducts);
router.post('/:cid/purchase', purchaseCart);
module.exports = router;
