const express = require('express');
const path = require('path');
const productManager = require('./productmanager');
const cartManager = require('./cartmanager');

const app = express();
const PORT = 8080;

app.use(express.json());

// para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getAllProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

//obtener un producto por ID
app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// para agregar productos
app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const createdProduct = await productManager.addProduct(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// actualizar productos x id
app.put('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// para eliminar productos
app.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    await productManager.deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// carts



// Crear carrito
app.post('/carts', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartProducts = await cartManager.getCartProducts(cartId);
    res.json(cartProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// agregar un producto a un carrito por ID de carrito y ID de producto
app.post('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const addedProduct = await cartManager.addProductToCart(cartId, productId);
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// errores
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
