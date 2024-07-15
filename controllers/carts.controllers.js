const CartDAO = require('../dao/carts.dao');
const Producto = require('../dao/models/products.model'); 
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


// Finalizar la compra y generar un ticket
const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productsToPurchase = cart.products;
        const productsNotPurchased = [];

        for (let i = 0; i < productsToPurchase.length; i++) {
            const cartProduct = productsToPurchase[i];
            const product = cartProduct.product;
            const quantityToPurchase = cartProduct.quantity;

            // Verifica si tiene la cantidad de stock necesaria, si la tiene actualiza el stock
            if (product.stock >= quantityToPurchase) {
                product.stock -= quantityToPurchase;
                await product.save();

                cartProduct.purchased = true;
            } else {
                productsNotPurchased.push(product._id);
            }
        }

        const purchasedProducts = productsToPurchase.filter(product => product.purchased);
        const notPurchasedProductIds = productsNotPurchased.map(id => id.toString());

        // Actualiza el carrito con los productos comprados
        cart.products = purchasedProducts;
        await cart.save();

        // Crea un ticket con lo que se compró
        const ticketData = {
            amount: calculateTotalAmount(purchasedProducts),
            purchaser: req.user.email,
        };

        const newTicket = await TicketService.createTicket(ticketData);

        if (notPurchasedProductIds.length > 0) {
            return res.status(400).json({ notPurchasedProducts: notPurchasedProductIds });
        }

        res.status(200).json({ message: 'Compra realizada correctamente', ticket: newTicket });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Error interno del servidor al finalizar la compra' });
    }
};

// Calcular el monto total de la compra
function calculateTotalAmount(products) {
    let total = 0;
    products.forEach(product => {
        total += product.product.precio * product.quantity;
    });
    return total;
}
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
        res.render('cart', { cart });
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
