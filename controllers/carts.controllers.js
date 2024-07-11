
const { Cart} = require('../dao/models/cart.model');
const { Producto } = require('../dao/models/products.model');
const {cartDAO} = require('../dao/carts.dao');
const {ProductoDAO} = require('../dao/products.dao');
const createTicket = require('../servicios/ticket.service');
const getAllCarts = async (req, res) => {
    try {
        const carritos = await Cart.find();
        res.json(carritos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartDAO.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message || 'Unknown error' });
    }
};

const createCart = async (req, res) => {
    try {
        const { productos } = req.body;

        const productosIDs = await Promise.all(productos.map(async (producto) => {
            const productoEncontrado = await Producto.findOne({ nombre: producto.nombre });
            if (productoEncontrado) {
                return { nombre: producto.nombre, cantidad: producto.cantidad, precio: productoEncontrado.precio };
            } else {
                return null;
            }
        }));

        const productosValidos = productosIDs.filter((producto) => producto !== null);

        const totalCalculado = productosValidos.reduce((total, producto) => {
            return total + (producto.precio * producto.cantidad);
        }, 0);

        const nuevoCarrito = await CartDAO.createCart({ productos: productosValidos });
        
        res.status(201).send('Carrito guardado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const result = await CartDAO.deleteCart(cid);

        if (!result) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

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

const updateCartProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const updatedCart = await CartDAO.updateCartProductQuantity(cid, pid, quantity);

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
        }

        res.json({ status: 'success', message: 'Cantidad de producto actualizada', payload: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const deleteCartProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const updatedCart = await CartDAO.removeProductFromCart(cid, pid);

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
        }

        res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: updatedCart });
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


const addProductToUserCart = async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        // Verifica si el carrito existe
        let cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).send('El carrito especificado no existe');
        }

        // Verifica si el producto existe
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('El producto especificado no existe');
        }

        // Agrega el producto al carrito con la cantidad especificada
        cart.products.push({ product: productId, quantity: parseInt(quantity, 10) });
        await cart.save();

        // Accede a los datos del usuario desde la sesión
        const user = req.session.user;

        res.render('products', { user }); // Renderiza la vista del carrito actualizada
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar producto al carrito');
    }
};
const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productsToPurchase = cart.products;
        const productsNotPurchased = [];

        // Procesar cada producto en el carrito
        for (let i = 0; i < productsToPurchase.length; i++) {
            const cartProduct = productsToPurchase[i];
            const product = cartProduct.product;
            const quantityToPurchase = cartProduct.quantity;

            // Verificar si hay suficiente stock
            if (product.stock >= quantityToPurchase) {
                // Actualizar el stock del producto
                product.stock -= quantityToPurchase;
                await product.save();

                // Agregar al proceso de compra
                cartProduct.purchased = true;
            } else {
                // Agregar a los productos no comprados
                productsNotPurchased.push(product._id);
            }
        }

        // Filtrar los productos comprados y no comprados
        const purchasedProducts = productsToPurchase.filter(product => product.purchased);
        const notPurchasedProductIds = productsNotPurchased.map(id => id.toString());

        // Actualizar el carrito con los productos no comprados
        cart.products = purchasedProducts;
        await cart.save();

        // Generar ticket con los productos comprados
        const ticketData = {
            amount: calculateTotalAmount(purchasedProducts), // Implementa esta función según tu lógica de cálculo
            purchaser: req.user.email, // Suponiendo que tienes el usuario en req.user
        };

        const newTicket = await TicketService.createTicket(ticketData);

        // Responder con los productos no comprados si hay alguno
        if (notPurchasedProductIds.length > 0) {
            return res.status(400).json({ notPurchasedProducts: notPurchasedProductIds });
        }

        res.status(200).json({ message: 'Compra realizada correctamente', ticket: newTicket });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ error: 'Error interno del servidor al finalizar la compra' });
    }
};

function calculateTotalAmount(products) {
    let total = 0;
    products.forEach(product => {
        total += product.product.precio * product.quantity; // Asumiendo que precio y cantidad están en la relación
    });
    return total;
}

module.exports = {
    getAllCarts,
    getCartById,
    createCart,
    deleteCart,
    updateCart,
    updateCartProductQuantity,
    deleteCartProduct,
    populateCartProducts,addProductToUserCart,purchaseCart
};
