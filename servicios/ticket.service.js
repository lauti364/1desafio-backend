const Ticket = require('../dao/models/ticket.model');

async function createTicket(ticketData) {
    try {
        const uniqueCode = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        if (!uniqueCode || uniqueCode.trim() === '') {
            throw new Error('Código único no válido');
        }

        const newTicket = new Ticket({
            code: uniqueCode,
            purchase_datetime: ticketData.purchase_datetime || new Date(),
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
