const Ticket = require('../dao/models/ticket.model');

async function createTicket(ticketData) {
    try {
        const newTicket = new Ticket({
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: ticketData.amount,
            purchaser: ticketData.purchaser,
        });

        await newTicket.save();
        return newTicket;
    } catch (error) {
        throw new Error('Error al crear el ticket');
    }
}

module.exports = {
    createTicket,
};
