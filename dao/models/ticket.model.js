const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, default: null },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;