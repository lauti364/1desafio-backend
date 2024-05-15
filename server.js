const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.routers');
const { Mensaje, Producto, Carrito } = require('./models/user.model');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas de productos
app.get('/products', async (req, res) => {
  try {
    const products = await Producto.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Producto.findById(productId);
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

app.post('/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const createdProduct = await Producto.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Producto.findByIdAndUpdate(productId, req.body, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Producto.findByIdAndDelete(productId);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Rutas de carritos
app.post('/carts', (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

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

//ver los mensajes
app.get('/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.find();
    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

//mandar mensajes
app.post('/mensajes', async (req, res) => {
  try {
    const { mensaje, email } = req.body;
    const nuevoMensaje = new Mensaje({ mensaje, email });
    await nuevoMensaje.save();
    res.status(201).send('Mensaje guardado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Manejador de errores de rutas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb+srv://lauti364:brisa2005@cluster0.utj99me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => { console.log("Conectado a la base de datos") })
  .catch(error => console.error("Error en la conexión", error));

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
