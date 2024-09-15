const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    stock: { type: Number, required: true },
    owner: { type: String, required: true },
    foto: { type: String, required: false }
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
 