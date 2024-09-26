import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quests'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Check if user has a Cold Brew in their inventory
      const coffee = inventory.collectables.find(item => item.id === '0');
      if (!coffee || coffee.quantity < 1) {
        return res.status(400).json({ message: 'Insufficient coffee' });
      }

      // Check if Morning Coffee quest is present (id: 3)
      const quest = await Quest.findOne({ username: username });
      const relevantQuest = quest.active_quests.find(quest => quest.id === '3');
      if (relevantQuest) {
        relevantQuest.quantity_achieved += 1;
        await quest.save();
      }

      // Remove one cold brew from the user's inventory
      coffee.quantity -= 1;

      // Update market time
      let currentDate = new Date();
      currentDate.setSeconds(currentDate.getSeconds() - 1); // Subtract 1 second
      inventory.market_time = currentDate;

      await inventory.save();

      res.status(200).json({ message: 'Coffee successfully used' });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
