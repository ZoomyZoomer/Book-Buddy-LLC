import { connectToDatabase } from './utils/db';
import User from './models/User';

export default async function handler(req, res) {

    const { username } = req.query;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json([user.notifications, user.globalNotificationsSeen]);

    } catch(e) {
        return res.status(400).json({error: 'Error: could not fetch notifications'});
    }

}