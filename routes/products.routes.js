const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct,} = require('../controllers/products.controllers');
const authorizeRole = require('../middleware/authorize');
const Producto = require('../dao/models/products.model');

// Obtiene todos los productos
router.get('/products', getAllProducts);

// Vista para un producto específico
router.get('/products/:id', getProductById);

// Crea un nuevo producto
router.post('/products', authorizeRole('admin'), createProduct);



// Admin

// Muestra formulario de crear producto y eliminar
router.get('/create', authorizeRole('admin'), (req, res) => {
    res.render('crearp', { title: 'Crear Producto' });
});


// Crear producto (solo administrador)
router.post('/', authorizeRole('admin'), createProduct);

module.exports = router;