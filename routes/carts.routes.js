const express = require('express');
const router = express.Router();
const {
    getAllCarts,
    createCart,
    deleteCart,
    updateCart,
    populateCartProducts,
    addProductsToCart,
    purchaseCart,
    getCartById,removeProductFromCart
} = require('../controllers/carts.controllers');
const authorizeRole = require('../middleware/authorize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Carrito:
 *       type: object
 *       properties:
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del producto
 *       required:
 *         - productos
 */

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [Carritos]
 *     responses:
 *       200:
 *         description: Lista de carritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carrito'
 */
router.get('/carts', getAllCarts);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carritos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrito'
 *     responses:
 *       201:
 *         description: Carrito creado con éxito
 */
router.post('/carts', createCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   delete:
 *     summary: Elimina un carrito por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito eliminado con éxito
 *       404:
 *         description: Carrito no encontrado
 */
router.delete('/carts/:cid', deleteCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   put:
 *     summary: Actualiza un carrito por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrito'
 *     responses:
 *       200:
 *         description: Carrito actualizado con éxito
 *       404:
 *         description: Carrito no encontrado
 */
router.put('/carts/:cid', updateCart);

/**
 * @swagger
 * /api/carts/{cid}/populate:
 *   get:
 *     summary: Llena el carrito con los productos seleccionados
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito lleno con productos
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/carts/:cid/populate', populateCartProducts);

/**
 * @swagger
 * /api/carts/{cartId}/add-product/{productId}:
 *   post:
 *     summary: Agrega un producto al carrito del usuario
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.post('/carts/:cartId/add-product/:productId', authorizeRole(['usuario']), addProductsToCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finaliza la compra del carrito
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada con éxito
 *       404:
 *         description: Carrito no encontrado
 */
router.post('/carts/:cid/purchase', authorizeRole(['usuario']), purchaseCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *  get:
 *     summary: Obtiene un carrito específico por ID
 *     tags: [Carritos]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrito'
 *       404:
 *         description: Carrito no encontrado
 */
router.get('/carts/:cid', getCartById);
router.post('/carts/:cartId/delete/:productId', authorizeRole(['usuario']), removeProductFromCart);
module.exports = router;