const express = require('express');
const router = express.Router();
const { Mensaje, Producto, Carrito } = require('../models/user.model');

// ruta para obtener todos los mensajes
router.get('/mensajes', async (req, res) => {
    try {
        const mensajes = await Mensaje.find();
        res.json(mensajes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
// agarra todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//para crear productos
router.post('/productos', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, descripcion });
        await nuevoProducto.save();
        res.status(201).send('Producto guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

// obtiene los carritos
router.get('/carritos', async (req, res) => {
    try {
        const carritos = await Carrito.find();
        res.json(carritos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//crear carrito
router.post('/carritos', async (req, res) => {
    try {
        const { productos, total } = req.body;
        const nuevoCarrito = new Carrito({ productos, total });
        await nuevoCarrito.save();
        res.status(201).send('Carrito guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;