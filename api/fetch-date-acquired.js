import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, sticker_id } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the sticker in the sticker collection
      const sticker = inventory.sticker_collection.find(sticker => sticker.sticker_id === sticker_id);

      if (!sticker) {
        // If the sticker is not found, add it with 'none' as the date acquired
        inventory.sticker_collection.push({ sticker_id: sticker_id, date_acquired: 'none' });
        await inventory.save();
        return res.status(200).json('none');
      } else {
        // Return the date acquired for the sticker
        return res.status(200).json(sticker.date_acquired);
      }

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
