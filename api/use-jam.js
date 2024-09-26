import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, index } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the relevant file based on the index provided
      const rel_file = inventory.active_files.find(file => (
        file.index[0] === index[0] && file.index[1] === index[1]
      ));
      if (!rel_file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Set the date_init to yesterday
      const currentDate = new Date();
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const yesterday = new Date(currentDate.getTime() - oneDayInMilliseconds);
      rel_file.date_init = yesterday;

      // Find the jam item in the inventory and decrement its quantity
      const jam = inventory.collectables.find(item => item.id === '2');
      if (!jam || jam.quantity <= 0) {
        return res.status(400).json({ message: 'Insufficient jam' });
      }
      jam.quantity -= 1;

      // Save the updated inventory
      await inventory.save();

      res.status(200).json({ message: 'Jam used successfully' });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
