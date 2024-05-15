const express = require('express');
const router = express.Router();
const { Mensaje, Producto, Carrito } = require('../models/user.model');

//rutas de messages
router.post('/msj', async (req, res) => {
    try {
      const { email, mensaje } = req.body;
  
      //hace el mesage con loos datos
      const nuevoMensaje = new Mensaje({ email, mensaje: mensaje });
      
      // lo guarda en la base de datos
      await nuevoMensaje.save();
  
      //muestra un mensaje si sale bien o mal
      res.send('Mensaje enviado correctamente');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
// agarra todos los productos
router.get('/products', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//para crear productos
router.post('/products', async (req, res) => {
    try {
        const { nombre, precio, descripcion, stock } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, descripcion, stock });
        await nuevoProducto.save();
        res.status(201).send('Producto guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});


// obtiene los carritos
router.get('/carts', async (req, res) => {
    try {
        const carritos = await Carrito.find();
        res.json(carritos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

//crear carrito
router.post('/carts', async (req, res) => {
    try {
        const { productos } = req.body;

        // busca x nombre y obtiene e precio
        const productosIDs = await Promise.all(productos.map(async (producto) => {
            const productoEncontrado = await Producto.findOne({ nombre: producto.nombre });
            if (productoEncontrado) {
                return { nombre: producto.nombre, cantidad: producto.cantidad, precio: productoEncontrado.precio };
            } else {
              //si no existe el product salta el null
                return null; 
            }
        }));

        // Ffiltra que ponga un product que exista
        const productosValidos = productosIDs.filter((producto) => producto !== null);

        // hace la * de products y cantidad
        const totalCalculado = productosValidos.reduce((total, producto) => {
            return total + (producto.precio * producto.cantidad);
        }, 0);

        //hace el carrito con los products y el total
        const nuevoCarrito = new Carrito({ productos: productosValidos, total: totalCalculado });
        await nuevoCarrito.save();
        
        res.status(201).send('Carrito guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/chat', (req, res) => {
    // Aquí puedes pasar datos a la vista si es necesario
    res.render('chat');
});
module.exports = router;