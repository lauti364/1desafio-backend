import CartDAO from '../dao/cartsDAO.js';

const cartService = new CartDAO();

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart(req.body);
    res.send({ status: "success", cart });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    res.send({ status: "success", cart });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const cart = await cartService.updateCart(req.params.id, req.body);
    res.send({ status: "success", cart });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    await cartService.deleteCart(req.params.id);
    res.send({ status: "success", message: "Cart deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const cart = await cartService.addProductToCart(cartId, productId, quantity);
    res.send({ status: "success", cart });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    const cart = await cartService.removeProductFromCart(cartId, productId);
    res.send({ status: "success", cart });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};
