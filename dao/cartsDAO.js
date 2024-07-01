import Cart from './models/carts.model';
class CartDAO {
  async createCart(cartData) {
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

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    return await cart.save();
  }
}

export default CartDAO;