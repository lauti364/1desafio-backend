const mongoose = require('mongoose');

// Definición del esquema de producto
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    stock: { type: Number, required: true }
});

const Producto = mongoose.model('Producto', productoSchema); // Nombre del modelo y esquema asociado

module.exports = Producto; // Exporta el modelo
