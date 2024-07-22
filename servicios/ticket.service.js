const Ticket = require('../dao/models/ticket.model');

async function createTicket(ticketData) {
    try {
        const newTicket = new Ticket({
            code: ticketData.code,
            purchase_datetime: ticketData.purchase_datetime,
            amount: ticketData.amount,
        });

        await newTicket.save();
        return newTicket;
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        throw new Error('Error al crear el ticket');
    }
}

module.exports = {
    createTicket,
};