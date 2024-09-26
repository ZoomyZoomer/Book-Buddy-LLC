import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary
import Quest from './models/Quests'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, file_id, index } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Update the warehouse grid with the new file
      inventory.warehouse_grid[index[0]][index[1]] = Number(file_id) + 10;
      inventory.markModified('warehouse_grid');

      // Add the new file to active files
      inventory.active_files.push({ file_id: file_id, index: index, date_init: new Date() });

      // Check the file's quantity
      const file = inventory.files.find(file => file.file_id === file_id);
      if (!file || file.quantity - 1 < 0) {
        return res.status(400).json({ message: "Insufficient files" });
      }

      // Check if warehouse file quest is present (id: 1)
      const quest = await Quest.findOne({ username: username });
      const relevant_quest = quest.active_quests.find(quest => quest.id === '1');

      if (relevant_quest && relevant_quest.quantity_achieved === 0) {
        relevant_quest.quantity_achieved += 1;
      }

      // Decrease the file quantity
      file.quantity -= 1;

      await inventory.save();
      await quest.save();

      res.status(200).json({ message: 'File added' });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
