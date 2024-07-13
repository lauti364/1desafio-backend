const Cart = require('./models/cart.model');
const Producto = require('./models/products.model');

class CartDAO {
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

      console.log('Cart products before adding:', cart.products);
      console.log('Product ID to add:', productId);

      const existingProductIndex = cart.products.findIndex(item => item.product && item.product.equals(productId));

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = Number(cart.products[existingProductIndex].quantity) + Number(quantity);
    } else {
        cart.products.push({ product: productId, quantity: Number(quantity) });
    }

      console.log('Cart products after adding:', cart.products);

      await product.save(); // Decrementar el stock del producto
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
    console.log(`DAO: Fetching cart by ID: ${cartId}`);
    const cart = await Cart.findById(cartId).populate('user').populate('products.product');
    console.log(`DAO: Cart found: ${JSON.stringify(cart)}`);
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

}


module.exports = new CartDAO();