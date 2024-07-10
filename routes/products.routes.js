const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, deleteProductById,} = require('../controllers/products.controllers')
const authorizeRole  = require('../middleware/authorize');
const { Producto } = require('../dao/models/products.model');
// Obtiene todos los productos
router.get('/products', getAllProducts);

// Vista para un producto específico
router.get('/products/:id', getProductById);

// Crea un nuevo producto
router.post('/products', authorizeRole ('admin'), createProduct);

//borrar un product x id 
router.delete('/products/:id', authorizeRole ('admin'), deleteProductById);



//admin

// Mostrar formulario de crear producto
router.get('/create', authorizeRole ('admin'), (req, res) => {
    res.render('createProduct', { title: 'Crear Producto' });
});

// Mostrar todos los productos y formulario de eliminación
router.get('/delete', authorizeRole ('admin'), async (req, res) => {
    try {
        const products = await Producto.find({});
        res.render('deleteProduct', { title: 'Eliminar Producto', products });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// Crear producto (solo administrador)
router.post('/', authorizeRole ('admin'), createProduct);

// Eliminar producto (solo administrador)
router.post('/delete/:id', authorizeRole ('admin'), async (req, res) => {
    const productId = req.params.id; 

    try {
        const deletedProduct = await Producto.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send('Producto no encontrado'); 
        }

        res.status(200).json({ message: 'Producto eliminado correctamente', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto'); 
    }
});





module.exports = router;