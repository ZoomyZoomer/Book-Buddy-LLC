import { connectToDatabase } from './utils/db'; // Adjust the path to your database connection utility
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ message: 'Missing username' });
        }

        try {
            // Connect to the database
            await connectToDatabase();

            const quest = await Quest.findOne({ username: username });

            // Check if quest exists
            if (!quest) {
                return res.status(404).json({ message: 'Quest not found' });
            }

            // Reset the streak
            quest.streak = 0;

            await quest.save();

            return res.status(200).json({ message: 'Streak reward claimed' });

        } catch (e) {
            console.error('Error updating streak reward:', e);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
