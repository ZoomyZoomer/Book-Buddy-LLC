import { connectToDatabase } from './utils/db';
import User from './models/User';

export default async function handler(req, res) {

    const { username, isImportant, rel_id } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        const rel_notif = user.globalNotificationsSeen.find((notif) => notif.id === rel_id);

        if (rel_notif){
            if (!isImportant){
                rel_notif.important = true;
            } else {
                rel_notif.important = false;
            }
        } else {
            user.globalNotificationsSeen.push({id: rel_id, important: true});
        }

        user.markModified('globalNotificationsSeen');
        await user.save();

        return res.status(200).json({message: 'Success!'});

    } catch(e) {
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }

}