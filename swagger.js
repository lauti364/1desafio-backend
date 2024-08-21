const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'documentacion api - desafio',
    version: '1.0.0',
    description: 'Documentación de la API para el módulo de productos y carrito.',
  },
  servers: [
    {
      url: 'http://localhost:8081',
      description: 'Servidor de desarrollo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;