import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, index } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      const quest = await Quest.findOne({ username: username });

      // Check if the quest exists and the index is valid
      if (!quest || !quest.active_quests[index]) {
        return res.status(404).json({ message: 'Quest not found or invalid index' });
      }

      // Mark the reward as claimed
      quest.active_quests[index].claimed = true;

      await quest.save();

      res.status(200).json({ message: 'Reward claimed' });

    } catch (e) {
      console.error('Error marking reward as claimed:', e);
      res.status(500).json({ error: 'Internal Server Error', details: e });
    }

  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
