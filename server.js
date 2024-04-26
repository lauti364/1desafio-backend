const express = require('express');
const path = require('path');
const productManager = require('./productmanager');
const cartManager = require('./carts/cartmanager');

const app = express();
const PORT = 8080;

app.use(express.json());

// agarra todos los productos con GET
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

// busca el producto x id
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

// agrega productos con POST
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

//actualiza los productos x el id
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

// elimina pproductos x el id
app.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct === null) {
      res.status(404).send('Producto inexistente');
    } else {
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('producto inexistente');
  }
});

// crea un nuevo cart
app.post('/carts', (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// obtiene el cart x el id
app.get('/carts/:cid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// agregar productos al cart
app.post('/carts/:cid/products/:pid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const updatedCart = cartManager.addProductToCart(cartId, productId, quantity);
    if (updatedCart.error) {
      res.status(404).json(updatedCart);
    } else {
      res.json(updatedCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

//errores de rutas 
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

//inicia el sv
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
