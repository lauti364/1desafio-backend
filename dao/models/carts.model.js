const mongoose = require('mongoose');

const carritoCollection = "Carritos";

// Schema de carritos
const carritoSchema = new mongoose.Schema({
    productos: [{
        nombre: { type: String, required: true }, 
        cantidad: { type: Number, required: true } 
    }],
});
// Modelos
const Carrito = mongoose.model(carritoCollection, carritoSchema);

module.exports = {
    Carrito
};