const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct,} = require('../controllers/products.controllers');
const authorizeRole = require('../middleware/authorize');
const Producto = require('../dao/models/products.model');
const { generateMockProducts } = require('../mocking')
const { CustomError, ERROR_productos,  } = require('../util/errores');
// obtiene todos los productos
router.get('/products', getAllProducts);

// vista de un producto específico
router.get('/products/:id', getProductById);

// crea un nuevo producto
router.post('/products', authorizeRole('admin'), createProduct);

 // desafio de mocking
router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

// Admin

// Muestra formulario de crear producto y eliminar
router.get('/create', authorizeRole('admin'), (req, res) => {
    res.render('crearp', { title: 'Crear Producto' });
});


// Crear producto (solo administrador)
router.post('/', authorizeRole('admin'), createProduct);

module.exports = router;