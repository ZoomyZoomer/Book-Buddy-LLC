import { connectToDatabase } from './utils/db';
import User from './models/User';

export default async function handler(req, res) {

    const { username, rel_id } = req.body;

    try {

        await connectToDatabase();

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        user.globalNotificationsSeen.push(rel_id);

        await user.save();

        return res.status(200).json({message: 'Success!'});

    } catch(e) {
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }

}