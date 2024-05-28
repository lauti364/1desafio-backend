const mongoose = require('mongoose');
const productoCollection = "Productos";
// Schema de productos
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    stock:{type:Number, required:true}
});

const Producto = mongoose.model(productoCollection, productoSchema);
module.exports = {
    Producto
};