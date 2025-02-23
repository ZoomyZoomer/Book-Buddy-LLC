import { connectToDatabase } from './utils/db';
import SupportTicket from './models/SupportTickets';
import User from './models/User';

export default async function handler(req, res) {

    const { username, ticketInfo } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const supportTicket = await SupportTicket.findOne({});

        supportTicket.receivedTickets.push({ticketId: supportTicket.globalTicketId, sentBy: username, dateSent: new Date(), ticketInfo: ticketInfo });

        user.supportTicketIds.push(supportTicket.globalTicketId);

        supportTicket.globalTicketId += 1;
        await supportTicket.save();
        await user.save();

        return res.status(200).json({message: 'Ticket successfully sent'});

    } catch(e) {
        console.error(e);
        res.status(400).json({ error: 'Ticket could not be sent' });
    }

}