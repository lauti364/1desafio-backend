const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;