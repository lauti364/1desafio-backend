
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    codigo: { type: String, unique: true, required: true },
    horario_de_compra: { type: Date, default: Date.now, required: true },
    precio: { type: Number, required: true },
    gmail: { type: String, required: true }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
