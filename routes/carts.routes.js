const express = require('express');
const router = express.Router();
const { Carrito } = require('../dao/models/carts.model');

// obtiene los carritos
// Ruta para obtener todos los carritos
router.get('/carts', async (req, res) => {
    try {
        const carritos = await Carrito.find();
        res.json(carritos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para obtener un carrito específico
// Sin el .lean() no funciona lo mismo con los products
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Carrito.findById(cartId).lean();

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message || 'Unknown error' });
    }
});

// Ruta para crear un nuevo carrito
router.post('/carts', async (req, res) => {
    try {
        const { productos } = req.body;

        // Busca productos por nombre y obtiene su precio
        const productosIDs = await Promise.all(productos.map(async (producto) => {
            const productoEncontrado = await Producto.findOne({ nombre: producto.nombre });
            if (productoEncontrado) {
                return { nombre: producto.nombre, cantidad: producto.cantidad, precio: productoEncontrado.precio };
            } else {
                return null;
            }
        }));

        // Filtra productos que existan
        const productosValidos = productosIDs.filter((producto) => producto !== null);

        // Calcula el total
        const totalCalculado = productosValidos.reduce((total, producto) => {
            return total + (producto.precio * producto.cantidad);
        }, 0);

        // Crea el carrito
        const nuevoCarrito = new Carrito({ productos: productosValidos });
        await nuevoCarrito.save();
        
        res.status(201).send('Carrito guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//endpoints de la pre-entrega 2 
//borra el carrito
router.delete('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = products;
        await cart.save();

        res.json({ status: 'success', message: 'Carrito actualizado', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// modificar stock
router.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const product = cart.products.find(p => p.product.toString() === pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        product.quantity = quantity;
        await cart.save();

        res.json({ status: 'success', message: 'Cantidad de producto actualizada', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});
//eliminar solo 1 procuto del carrito
router.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});
//usa el populate para obtener todos los products del carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});
module.exports = router;