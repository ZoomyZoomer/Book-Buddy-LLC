import { connectToDatabase } from './utils/db';
import Bookshelf from './models/Bookshelf';
import User from './models/User';

export default async function handler(req, res) {

    const { username, rel_id } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const shelf = await Bookshelf.findOne({ username: username });
        if (!shelf) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const rel_popup = shelf.emoji_popups.find((popup) => popup.id === 1);

        if (!rel_popup){
            shelf.emoji_popups.push({num_used: 0, claimed_today: false, show: true, time: new Date(), id: 1});
        } else {
            rel_popup.show = true;
        }

        await shelf.save();

        const rel_notification = user.globalNotificationsSeen.find((notif) => notif.id === rel_id);
        if (rel_notification){
            rel_notification.claimed = true;
            user.markModified('globalNotificationsSeen');
        } else {
            user.globalNotificationsSeen.push({id: rel_id, important: false, claimed: true});
        }

        await user.save();
        
        return res.status(200).json({message: 'Success!'});

    } catch(e) {
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }

}