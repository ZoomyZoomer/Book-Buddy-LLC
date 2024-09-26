import { connectToDatabase } from './utils/db'; // Import your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quests'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory and quest for the given username
      const inventory = await Inventory.findOne({ username: username });
      const quest = await Quest.findOne({ username: username });

      if (!inventory || !quest) {
        return res.status(404).json({ message: 'Inventory or Quest not found' });
      }

      // Update "Put it on My Card" achievement (id: 15)
      const achievement = quest.active_achievements.find(ach => ach.id === '15');

      // Already an active achievement (in progress)
      if (achievement) {
        if (!achievement.claimed) {
          achievement.quantity = inventory.currency.coins;
        }
      } else {
        quest.active_achievements.push({ id: '15', quantity: inventory.currency.coins });
      }

      // Save the updated quest
      await quest.save();

      // Respond with the currency data
      const fileQuantity = inventory.files.find(file => file.file_id === '40')?.quantity || 0;
      res.status(200).json([inventory.currency.coins, inventory.currency.xp, fileQuantity]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
