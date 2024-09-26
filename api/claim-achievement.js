import connectToDatabase from './utils/db'; // adjust the path to your database utility
import Quest from './models/Quests';
import Inventory from './models/Inventory'; // adjust the path to your Inventory model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, achievement, clientAchievement, isCompleted } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      const quest = await Quest.findOne({ username: username });

      // Check if achievement reward was already claimed
      if (isCompleted) {
        return res.status(401).json({ message: 'Achievement Already Claimed' });
      }

      // Check if achievement is active
      if (!clientAchievement) {
        return res.status(400).json({ message: 'Achievement Incomplete' });
      }

      // Check if claim is valid (achievement is 100% complete)
      if (clientAchievement.quantity < achievement.quantity) {
        return res.status(400).json({ message: 'Achievement Incomplete' });
      }

      res.status(200).json({message: 'k'});
      return;

      // Claim the reward
      const inventory = await Inventory.findOne({ username: username });

      // Handle file reward
      if (achievement.reward?.file) {
        const related_file = inventory.files.find(file => file.file_id === achievement.reward.file_id);
        if (!related_file) {
          inventory.files.push({ file_id: achievement.reward.file_id, quantity: 1 });
        } else {
          related_file.quantity += 1;
        }

      // Handle item reward
      } else if (achievement.reward?.item) {
        const related_item = inventory.collectables.find(item => item.id === achievement.reward.item_id);
        if (!related_item) {
          inventory.collectables.push({ id: achievement.reward.item_id, quantity: 1 });
        } else {
          related_item.quantity += 1;
        }
      
      }

      // Mark achievement as claimed
      const related_achievement = quest.active_achievements.find(ach => ach.id === clientAchievement.id);
      related_achievement.claimed = true;
      related_achievement.date = new Date();

      await quest.save();
      await inventory.save();

      res.status(200).json({ message: 'Achievement claimed' });

    } catch (e) {
      console.error('Error claiming achievement:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
