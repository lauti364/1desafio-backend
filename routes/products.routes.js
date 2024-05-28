const express = require('express');
const router = express.Router();
const {Producto} = require('../dao/models/products.model');

// Obtiene todos los productos


router.get('/products', async (req, res) => {
    try {
        // Obtiene los parámetros de la consulta
        let { limit = 10, page = 1, sort = '', query = '' } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        // Permite buscar por nombre
        const filter = query ? { nombre: new RegExp(query, 'i') } : {};

        // Calcula el total de documentos y las páginas
        const totalDocuments = await Producto.countDocuments(filter);
        const totalPages = Math.ceil(totalDocuments / limit);

        // Consulta los productos con los parámetros
        const productos = await Producto.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort(sort)
            .lean();

        // Prepara la respuesta
        const response = {
            products: productos,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        };

        // Renderiza la plantilla de productos con los datos
        res.render('products', response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});




// Vista para un producto específico
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca el producto por ID
        const producto = await Producto.findById(id);

        // Renderiza la plantilla de detalles de producto con los datos
        res.render('product-details', { producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

// Crea un nuevo producto
router.post('/products', async (req, res) => {
    try {
        const { nombre, precio, descripcion, stock } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, descripcion, stock });
        await nuevoProducto.save();
        res.status(200).send('Producto agregado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});
module.exports = router;