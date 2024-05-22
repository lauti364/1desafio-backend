const express = require('express');
const router = express.Router();
const { Mensaje, Producto, Carrito } = require('../../models/user.model');

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

router.get('/chat', (req, res) => {
    res.render('chat');
});
module.exports = router;