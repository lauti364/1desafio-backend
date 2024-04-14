const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

// todos los productos

app.get('/products', (req, res) => {
  const productsPath = path.join(__dirname, 'productos.json');
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    // x limite


    const products = JSON.parse(data);
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    if (limit < 0) {
      res.status(400).send('El límite debe ser un número positivo');
      return;
    }
    const firstProducts = products.slice(0, limit);
    res.json(firstProducts);
  });
});

// x id
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  if (Number.isNaN(productId)) {
    res.status(400).send('El ID del producto debe ser un número');
    return;
  }

  // para errores 

  const productsPath = path.join(__dirname, 'productos.json');
  fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    const products = JSON.parse(data);
    const product = products.find(prod => prod.id === productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  });
});



app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

