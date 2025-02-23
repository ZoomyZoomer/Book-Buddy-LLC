import { connectToDatabase } from './utils/db';
import SupportTicket from './models/SupportTickets';
import User from './models/User';

export default async function handler(req, res) {

    const { username } = req.query;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const supportTicket = await SupportTicket.findOne({});

        const rel_ids = user.supportTicketIds.slice(-3);

        const retrievedTickets = supportTicket.receivedTickets.filter(ticket => rel_ids.includes(ticket.ticketId));

        return res.status(200).json(retrievedTickets.reverse());

    } catch(e) {
        console.error(e);
        res.status(400).json({ error: 'Tickets could not be retrieved' });
    }

}