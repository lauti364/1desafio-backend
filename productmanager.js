const express = require('express');
const path = require('path');
const productManager = require('./productmanager');

const app = express();
const PORT = 8080;

app.use(express.json());

// Obtener todos los productos
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

// Obtener un producto por ID
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

// Agregar un nuevo producto
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

// Actualizar un producto por ID
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

// Eliminar un producto por ID
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

// error
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
