const Cart = require('../dao/models/cart.model');
const producto = require('../dao/models/products.model');
class CartDAO {
  async addtocart(cartId, productId, quantity) {
      try {
          // Buscar el carrito por su ID y asegurarse de que exista
          let cart = await Cart.findById(cartId);
          if (!cart) {
              throw new Error('Carrito no encontrado');
          }

          // Buscar el producto por su ID y asegurarse de que exista
          const product = await Producto.findById(productId);
          if (!product) {
              throw new Error('Producto no encontrado');
          }

          // Verificar si hay suficiente stock disponible
          if (product.stock < quantity) {
              throw new Error('No hay suficiente stock disponible');
          }

          // Añadir el producto al carrito
          const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));

          if (existingProductIndex !== -1) {
              // Si el producto ya está en el carrito, actualizar la cantidad
              cart.products[existingProductIndex].quantity += quantity;
          } else {
              // Si el producto no está en el carrito, añadirlo con la cantidad especificada
              cart.products.push({ product: productId, quantity });
          }

          // Guardar y devolver el carrito actualizado
          return await cart.save();
      } catch (error) {
          throw error;
      }
  }async createCart(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }
  
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('user').populate('products.productId');
  }
  
  async updateCart(cartId, cartData) {
    return await Cart.findByIdAndUpdate(cartId, cartData, { new: true });
  }
  
  async deleteCart(cartId) {
    return await Cart.findByIdAndDelete(cartId);
  }
  
}



module.exports = CartDAO;
