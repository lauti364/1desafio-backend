const CartDAO = require('../dao/carts.dao');
const Producto = require('../dao/models/products.model'); 
const Cart = require('../dao/models/cart.model');
const { createTicket } = require('../servicios/ticket.service'); 
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

// Eliminar un carrito por ID
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

// Actualizar un carrito por ID
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

// Popular productos del carrito
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

// Añadir productos al carrito
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
        console.log(`Intentando finalizar compra para carrito con ID: ${cid}`);

        // Busca el carrito por su ID y poblamos los productos asociados
        const cart = await Cart.findById(cid).populate('products.product');

        console.log('Carrito encontrado:', cart);

        if (!cart) {
            console.log(`Carrito no encontrado para ID ${cid}`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const productsNotPurchased = [];

        // Itera sobre los productos en el carrito
        for (let cartProduct of cart.products) {
            const product = await Producto.findById(cartProduct.product._id);

            console.log(`Procesando producto: ${product.nombre}`);

            if (!product) {
                console.log(`Producto no encontrado para ID ${cartProduct.product._id}`);
                throw new Error(`Producto no encontrado para ID ${cartProduct.product._id}`);
            }

            // Verifica si hay suficiente stock para realizar la compra
            if (product.stock >= cartProduct.quantity) {
                // Actualiza el stock del producto
                product.stock -= cartProduct.quantity;
                await product.save();

                // Calcula el monto total de la compra
                totalAmount += product.precio * cartProduct.quantity;
                cartProduct.purchased = true;
            } else {
                // Registra los productos que no se pudieron comprar por falta de stock
                productsNotPurchased.push(cartProduct.product._id.toString());
            }
        }

        // Filtra los productos comprados y actualiza el carrito
        cart.products = cart.products.filter(product => product.purchased);
        await cart.save();

        // Genera el ticket de compra
        const ticketData = {
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: totalAmount,
        };

        console.log('Generando ticket de compra:', ticketData);

        // Crea el ticket y obtiene el resultado
        const newTicket = await createTicket(ticketData);
        

        
        // Si hay productos que no se pudieron comprar, retorna un error
        if (productsNotPurchased.length > 0) {
            console.log('Algunos productos no pudieron comprarse:', productsNotPurchased);
            return res.status(400).json({ notPurchasedProducts: productsNotPurchased });
        }

        // Finaliza la compra exitosamente
        console.log('Compra realizada correctamente');
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

// le asigne un codigo unico a cada ticket
const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
};





const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log(`Fetching cart with ID: ${cartId}`);
        const cart = await CartDAO.getCartById(cartId);

        if (!cart) {
            console.log(`Cart with ID ${cartId} not found`);
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log(`Cart found: ${JSON.stringify(cart)}`);

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