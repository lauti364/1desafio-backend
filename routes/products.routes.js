const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/products.controllers');
const authorizeRole = require('../middleware/authorize');
const Producto = require('../dao/models/products.model');
const { generateMockProducts } = require('../mocking');
const { CustomError, ERROR_productos } = require('../util/errores');

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del producto
 *         precio:
 *           type: number
 *           description: El precio del producto
 *         descripcion:
 *           type: string
 *           description: Una descripción del producto
 *         stock:
 *           type: integer
 *           description: Cantidad disponible en inventario
 *       required:
 *         - nombre
 *         - precio
 *         - stock
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de todos los productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto específico por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/products/:id', getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (solo administrador)
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *       403:
 *         description: No autorizado
 */
router.post('/products', authorizeRole('admin'), createProduct);

/**
 * @swagger
 * /mockingproducts:
 *   get:
 *     summary: Obtiene una lista de productos simulados
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos simulados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

/**
 * @swagger
 * /create:
 *   get:
 *     summary: Muestra el formulario para crear productos (solo administrador)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Formulario de creación de productos
 *       403:
 *         description: No autorizado
 */
router.get('/create', authorizeRole('admin'), (req, res) => {
    res.render('crearp', { title: 'Crear Producto' });
});

module.exports = router;
