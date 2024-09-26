import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, index, payment_required } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Check if the user has enough coins
      if (payment_required <= inventory.currency.coins) {
        // Deduct coins and remove the obstruction
        inventory.currency.coins -= payment_required;
        inventory.warehouse_grid[index[0]][index[1]] = 0;

        // Mark the warehouse grid as modified and save the inventory
        inventory.markModified('warehouse_grid');
        await inventory.save();

        return res.status(200).json({ message: 'Obstruction removed' });
      } else {
        return res.status(400).json({ message: 'Insufficient coins' });
      }

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
