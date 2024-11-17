import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Inventory from './models/Inventory'; // Adjust the path to your Inventory model
import Quest from './models/Quests'; // Adjust the path to your Quest model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, market, value, type } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch user's inventory
      const inventory = await Inventory.findOne({ username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      const discount = inventory.active_coupon;

      // Handle payment
      if (market.cost.coins) {
        const cost = discount ? market.cost.discounted_amount : market.cost.amount;

        if (inventory.currency.coins < cost * value) {
          return res.status(400).json({ message: 'Not enough coins' });
        }

        inventory.currency.coins -= cost * value;
        if (discount) inventory.active_coupon = false;

      } else if (market.cost?.file) {
        const relevantFile = inventory.files.find(file => file.file_id === market.cost.id);
        if (!relevantFile) {
          return res.status(400).json({ message: 'Not enough files' });
        }

        const cost = discount ? market.cost.discounted_amount : market.cost.amount;

        if (relevantFile.quantity < cost * value) {
          return res.status(400).json({ message: 'Not enough files' });
        }

        relevantFile.quantity -= cost * value;
        if (discount) inventory.active_coupon = false;

      } else if (market.cost?.dollar) {
        return res.status(200).json({ message: 'Payment processed' });
      }

      // Add or update item in inventory
      const relevantItem = inventory.collectables.find(item => item.id === market.id);
      if (!relevantItem) {
        inventory.collectables.push({ id: market.id, quantity: Number(value) });
      } else {
        relevantItem.quantity += Number(value);
      }

      // Update stock
      if (type === 0) {
        inventory.market_small[0].stock -= Number(value);
        inventory.markModified('market_small');
      } else if (type === 1) {
        inventory.market_large[0].stock -= Number(value);
        inventory.markModified('market_large');
      }

      // Fetch user's quest data
      const quest = await Quest.findOne({ username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest data not found' });
      }

      // Update achievements and quests
      const updateAchievement = (id, quantity) => {
        const achievement = quest.active_achievements.find(ach => ach.id === id);
        if (achievement) {
          achievement.quantity += quantity;
        } else {
          quest.active_achievements.push({ id, quantity });
        }
      };

      updateAchievement('6', value); // Lucky Penny achievement
      updateAchievement('11', value); // The Big Bucks achievement

      const relevantQuest = quest.active_quests.find(q => q.id === '4');
      if (relevantQuest && relevantQuest.quantity_achieved < 1) {
        relevantQuest.quantity_achieved += 1;
      }

      await quest.save();
      await inventory.save();

      res.status(200).json({ message: 'Item successfully purchased' });

    } catch (error) {
      console.error('Error purchasing item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
