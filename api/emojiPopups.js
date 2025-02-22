import { connectToDatabase } from './utils/db';
import Bookshelf from './models/Bookshelf';
import User from './models/User'

export default async function handler(req, res) {

    const { username } = req.query;

    try {

        await connectToDatabase();

        const shelf = await Bookshelf.findOne({ username });
        if (!shelf) {
            return res.status(404).json({ message: 'Bookshelf not found' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        return res.status(200).json([shelf.emoji_popups.map((popup) => ({ 
            id: popup.id, 
            claimed_today: popup.claimed_today, 
            show: popup.show 
        })), user.globalNotificationsSeen.length]);
        

    } catch(e) {
        console.error('Error recording entry:', e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}