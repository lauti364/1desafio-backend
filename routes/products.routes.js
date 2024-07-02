const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/products.controllers')

// Obtiene todos los productos
router.get('/products', getAllProducts);

// Vista para un producto específico
router.get('/products/:id', getProductById);

// Crea un nuevo producto
router.post('/products', createProduct);

module.exports = router;