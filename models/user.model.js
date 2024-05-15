const mongoose = require('mongoose');

// Nombres de las colecciones
const mensajeCollection = "Mensajes";
const productoCollection = "Productos";
const carritoCollection = "Carritos";

// Schema de mensajes
const mensajeSchema = new mongoose.Schema({
    mensaje: { type: String, required: true },
    email: { type: String, required: true, max: 50 }
});

// Schema de productos
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true }
});

// Schema de carritos
const carritoSchema = new mongoose.Schema({
    productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }], // Lista de productos en el carrito
    total: { type: Number, required: true }
});

// Modelos
const Mensaje = mongoose.model(mensajeCollection, mensajeSchema);
const Producto = mongoose.model(productoCollection, productoSchema);
const Carrito = mongoose.model(carritoCollection, carritoSchema);

module.exports = {
    Mensaje,
    Producto,
    Carrito
};
