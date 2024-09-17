const Cart = require('./models/cart.model');
const Producto = require('./models/products.model');
const logger = require('../util/logger.js');
class CartDAO {
  async removeProductFromCart(cartId, productId) {
    try {
      // Convertir productId a ObjectId
      const productIdToRemove = mongoose.Types.ObjectId(productId);

      // Buscar el carrito por ID
      const cart = await Cart.findById(cartId).populate('products.product');

      if (!cart) {
        throw new Error(`Carrito no encontrado para ID ${cartId}`);
      }

      // Filtrar el producto del carrito
      const updatedProducts = cart.products.filter(product => 
        product.product._id.toString() !== productIdToRemove.toString()
      );

      // Verificar si el producto fue encontrado y eliminado
      if (updatedProducts.length === cart.products.length) {
        throw new Error('Producto no encontrado en el carrito');
      }

      // Actualizar el carrito con los productos restantes
      cart.products = updatedProducts;
      await cart.save();

      return { status: 'success', message: 'Producto eliminado del carrito', payload: cart };
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      throw error;
    }
  }




  async addToCart(cartId, productId, quantity) {
    try {
      let cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito no encontrado para ID ${cartId}`);
      }

      const product = await Producto.findById(productId);
      if (!product) {
        throw new Error(`Producto no encontrado para ID ${productId}`);
      }

      if (product.stock < quantity) {
        throw new Error('No hay suficiente stock disponible');
      }

      logger.info('Cart products before adding:', cart.products);
      logger.info('Product ID to add:', productId);

      const existingProductIndex = cart.products.findIndex(item => item.product && item.product.equals(productId));

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = Number(cart.products[existingProductIndex].quantity) + Number(quantity);
    } else {
        cart.products.push({ product: productId, quantity: Number(quantity) });
    }

      logger.info('Cart products after adding:', cart.products);

      await product.save();
      return await cart.save();
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      throw error;
    }
  }

  async createCart(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async getCartById(cartId) {
    logger.info(`DAO: Fetching cart by ID: ${cartId}`);
    const cart = await Cart.findById(cartId).populate('user').populate('products.product');
    logger.info(`DAO: Cart found: ${JSON.stringify(cart)}`);
    return cart;
}

  async updateCart(cartId, cartData) {
    return await Cart.findByIdAndUpdate(cartId, cartData, { new: true });
  }

  async deleteCart(cartId) {
    return await Cart.findByIdAndDelete(cartId);
  }
  async getCartByUserId(userId) {
    return await Cart.findOne({ user: userId }).populate('products.product');
}
async purchaseCart(cartId) {
  try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
          throw new Error(`Carrito no encontrado para ID ${cartId}`);
      }

      let totalAmount = 0;
      const failedProducts = [];

      for (const item of cart.products) {
          const product = await Producto.findById(item.product._id);
          if (!product) {
              throw new Error(`Producto no encontrado para ID ${item.product._id}`);
          }

          if (product.stock >= item.quantity) {
              product.stock -= item.quantity;
              totalAmount += product.precio * item.quantity;
              await product.save();
          } else {
              failedProducts.push(item.product._id);
          }
      }

      const purchasedProducts = cart.products.filter(item => !failedProducts.includes(item.product._id));
      cart.products = purchasedProducts;

      await this.saveCart(cart);

      if (failedProducts.length > 0) {
          return { notPurchasedProducts: failedProducts };
      } else {
          return { message: 'Compra finalizada exitosamente' };
      }
  } catch (error) {
      console.error('Error al finalizar la compra:', error);
      throw error;
  }
}

async saveCart(cart) {
  return await cart.save();
}

async saveTicket(ticket) {
  return await ticket.save();
}

}



module.exports = new CartDAO();