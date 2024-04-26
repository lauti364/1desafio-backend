const express = require('express');
const path = require('path');
const productManager = require('./productmanager');
const cartManager = require('./carts/cartmanager');

const app = express();
const PORT = 8080;

app.use(express.json());

// Endpoint para obtener todos los productos
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

// Endpoint para obtener un producto por ID
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

// Endpoint para agregar productos
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

// Endpoint para actualizar productos por ID
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

// Endpoint para eliminar productos por ID
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

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciando el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

//Carts-------------------------------------------------------------------------
