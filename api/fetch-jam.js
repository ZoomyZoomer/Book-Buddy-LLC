import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

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

      // Find the jam item in the inventory
      const jam = inventory.collectables.find(item => item.id === '2');

      // Return the quantity of jam or 0 if not found
      res.status(200).json(jam ? jam.quantity : 0);

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}