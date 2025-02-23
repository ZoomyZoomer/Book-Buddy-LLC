const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TicketSchema = new Schema({
    ticketId: {
        type: Number,
        required: true
    },
    sentBy: {
        type: String,
        required: true
    },
    dateSent: {
        type: Date
    },
    ticketInfo: {
        type: Object
    },
    ticketResponse: {
        type: String,
        default: ''
    },
    responseDate: {
        type: Date
    },
    ticketStatus: {
        type: String,
        default: 'In Progress'
    }
})

const SupportTicketSchema = new Schema({
    receivedTickets: [TicketSchema],
    globalTicketId: {
        type: Number,
        default: 134768293
    }
})

const TicketModel = model('SupportTickets', SupportTicketSchema);

module.exports = TicketModel;