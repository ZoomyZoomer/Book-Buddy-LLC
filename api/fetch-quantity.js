import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, file_id } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the item in the user's files
      const item = inventory.files.find(file => file.file_id === file_id);

      if (!item) {
        // If the item is not found, initialize it with a quantity of 0
        inventory.files.push({ file_id: file_id, quantity: 0 });
        await inventory.save();
        res.status(200).json(0);
      } else {
        // If the item is found, return its quantity
        res.status(200).json(item.quantity);
      }

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
