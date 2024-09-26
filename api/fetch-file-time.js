import { connectToDatabase } from './utils/db'; // Adjust the path to your DB connection utility
import Inventory from './models/Inventory'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, index } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the inventory for the given username
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the relevant file based on the index provided
      const file = inventory.active_files.find(file => 
        [`${parseInt(file.index[0])}`, `${parseInt(file.index[1])}`].every((f, i) => f === index[i])
      );

      if (!file) {
        return res.status(200).json("woops"); // You may want to change this response
      }

      res.status(200).json(file.date_init);

    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
