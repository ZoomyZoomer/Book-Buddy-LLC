import { connectToDatabase } from './utils/db'; // Import your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quests'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      let notFiles = [1, 2, 8, 9];
      let allValid = true;

      // Check the warehouse grid for valid files
      for (let i = 0; i < inventory.warehouse_grid.length; i++) {
        for (let j = 0; j < inventory.warehouse_grid[i].length; j++) {
          if (notFiles.includes(inventory.warehouse_grid[i][j])) {
            allValid = false;
            break;
          }
        }
        if (!allValid) break;
      }

      // Fetch the quest for the given username
      const quest = await Quest.findOne({ username: username });
      if (!quest) {
        return res.status(404).json({ message: 'Quest not found' });
      }

      if (allValid) {
        // Update "I See It All!" achievement (id: 14)
        const achievement = quest.active_achievements.find(ach => ach.id === '14');

        // Already an active achievement (in progress)
        if (achievement) {
          achievement.quantity = 1;
        } else {
          quest.active_achievements.push({ id: '14', quantity: 1 });
        }
      }

      // Update "King of the Corners" achievement (id: 9)
      const achievement2 = quest.active_achievements.find(ach => ach.id === '9');
      let count = 0;

      // Check specific grid positions
      if (!notFiles.includes(inventory.warehouse_grid[0][0])) count++;
      if (!notFiles.includes(inventory.warehouse_grid[0][6])) count++;
      if (!notFiles.includes(inventory.warehouse_grid[4][0])) count++;
      if (!notFiles.includes(inventory.warehouse_grid[4][6])) count++;

      // Already an active achievement (in progress)
      if (achievement2) {
        achievement2.quantity = count;
      } else {
        quest.active_achievements.push({ id: '9', quantity: count });
      }

      // Save the updated quest
      await quest.save();

      // Respond with the warehouse grid data
      res.status(200).json(inventory.warehouse_grid);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
