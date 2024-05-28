const mongoose = require('mongoose');

// Nombres de las colecciones
const mensajeCollection = "Mensajes";

// Schema de mensajes
const mensajeSchema = new mongoose.Schema({
    mensaje: { type: String, required: true },
    email: { type: String, required: true, max: 50 }
});

// Modelos
const Mensaje = mongoose.model(mensajeCollection, mensajeSchema);

module.exports = {
    Mensaje,
};
