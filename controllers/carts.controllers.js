const CartDAO = require('../dao/carts.dao');
const Producto = require('../dao/models/products.model'); 
const Cart = require('../dao/models/cart.model');
const { createTicket,uniqueCode } = require('../servicios/ticket.service'); 
const logger = require('../util/logger');
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'lautivp16@gmail.com',
        pass: 'nutw zcqi wneu yscg'         
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendTicketEmail = async (userEmail, ticket) => {
    const mailOptions = {
        from: 'lautivp16@gmail.com',
        to: userEmail,
        subject: 'Tu Ticket de Compra',
        html: `
            <h1>Gracias por tu compra!</h1>
            <p>Detalles de tu compra:</p>
            <ul>
                <li><strong>Código:</strong> ${ticket.code}</li>
                <li><strong>Fecha de Compra:</strong> ${ticket.purchase_datetime}</li>
                <li><strong>Monto:</strong> ${ticket.amount}</li>
            </ul>
            <p>¡Gracias por comprar con nosotros!</p>
        `
    };
      

    
    
    
    
    
        try {
        await transporter.sendMail(mailOptions);
        logger.info('Ticket enviado al usuario.');
    } catch (error) {
        logger.error('Error al enviar el ticket:', error);
    }
};





const getAllCarts = async (req, res) => {
    try {
        const carritos = await Cart.find();
        res.json(carritos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        const { productos } = req.body;

        const productosIDs = await Promise.all(productos.map(async (producto) => {
            const productoEncontrado = await Producto.findOne({ nombre: producto.nombre });
            if (productoEncontrado) {
                return { product: productoEncontrado._id, quantity: producto.cantidad, precio: productoEncontrado.precio };
            } else {
                return null;
            }
        }));

        const productosValidos = productosIDs.filter((producto) => producto !== null);

        const totalCalculado = productosValidos.reduce((total, producto) => {
            return total + (producto.precio * producto.quantity);
        }, 0);

        const nuevoCarrito = await CartDAO.createCart({ products: productosValidos });

        res.status(201).send('Carrito guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

// eliminar un carrito por ID
const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const result = await CartDAO.deleteCart(cid);

        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito eliminado', payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// actualiza el cart
const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const updatedCart = await CartDAO.updateCart(cid, { products });

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito actualizado', payload: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const populateCartProducts = async (req, res) => {
    try {
        const { cid } = req.params;

        const populatedCart = await CartDAO.populateCartProducts(cid);

        if (!populatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', payload: populatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// añade los productos al cart
const addProductsToCart = async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    try {
        const updatedCart = await CartDAO.addToCart(cartId, productId, quantity);

        req.session.user.cart = updatedCart._id;

        // Redirige a ver el carrito
        res.redirect(`/api/carts/${updatedCart._id}`);
    } catch (error) {
        console.error('Error al agregar productos al carrito:', error);
        res.status(500).send('Error al agregar productos al carrito');
    }
};


//hace el ticekt de la compra final
const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        logger.info(`Intentando finalizar compra para carrito con ID: ${cid}`);

        const cart = await Cart.findById(cid).populate('products.product');

        logger.info('Carrito encontrado:', cart);

        if (!cart) {
            logger.error(`Carrito no encontrado para ID ${cid}`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const productsNotPurchased = [];

        for (let cartProduct of cart.products) {
            const product = await Producto.findById(cartProduct.product._id);

            logger.info(`Procesando producto: ${product.nombre}`);

            if (!product) {
                logger.error(`Producto no encontrado para ID ${cartProduct.product._id}`);
                throw new Error(`Producto no encontrado para ID ${cartProduct.product._id}`);
            }

            // comprueba si hay stock
            if (product.stock >= cartProduct.quantity) {
                // modifica el stock
                product.stock -= cartProduct.quantity;
                await product.save();

                // hace un *
                totalAmount += product.precio * cartProduct.quantity;
                cartProduct.purchased = true;
            } else {
                // los que no se compran x stock y los saca del cart
                productsNotPurchased.push(cartProduct.product._id.toString());
            }
        }

        // actualiza el cart 
        cart.products = cart.products.filter(product => product.purchased);
        await cart.save();

        const ticketData = {
            purchase_datetime: new Date(),
            amount: totalAmount,
        };

        logger.info('Generando ticket de compra:', ticketData);

        const newTicket = await createTicket(ticketData);
        await sendTicketEmail(req.session.user.email, newTicket);
        // retorna los que no se pueden comprar
        if (productsNotPurchased.length > 0) {
            logger.info('Algunos productos no pudieron comprarse:', productsNotPurchased);
            return res.status(400).json({ notPurchasedProducts: productsNotPurchased });
        }

        // finaliza la compra
        logger.info('Compra realizada correctamente');
        res.status(200).json({ message: 'Compra realizada correctamente', ticket: newTicket });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Error interno del servidor al finalizar la compra' });
    }
};

// hace un * entre quantity y precio
const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => total + product.product.precio * product.quantity, 0);
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        logger.info(`Fetching cart with ID: ${cartId}`);
        const cart = await CartDAO.getCartById(cartId);

        if (!cart) {
            logger.error(`Cart with ID ${cartId} not found`);
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        logger.info(`Cart found: ${JSON.stringify(cart)}`);

        const plainCart = cart.toObject();
        
        res.render('cart', { cart: plainCart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message || 'Unknown error' });
    }
};

module.exports = {
    getAllCarts,
    createCart,
    deleteCart,
    updateCart,
    populateCartProducts,addProductsToCart,purchaseCart,getCartById
};