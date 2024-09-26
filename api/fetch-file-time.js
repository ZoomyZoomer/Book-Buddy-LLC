import { connectToDatabase } from './utils/db'; // Adjust the path accordingly
import Inventory from './models/Inventory'; // Adjust the path accordingly

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, index } = req.query;

    if (!username || !index) {
      return res.status(400).json({ message: 'Missing username or index' });
    }

    let parsedIndex;

    // Ensure index is an array
    try {
      parsedIndex = JSON.parse(index); // If index is a stringified array, parse it
    } catch (error) {
      return res.status(400).json({ message: 'Invalid index format' });
    }

    if (!Array.isArray(parsedIndex) || parsedIndex.length !== 2) {
      return res.status(400).json({ message: 'Index must be an array with two elements' });
    }

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's inventory
      const inventory = await Inventory.findOne({ username: username });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find file using index
      const file = inventory.active_files.find(file => 
        file.index[0] === parsedIndex[0] && file.index[1] === parsedIndex[1]
      );

      if (!file) {
        return res.status(404).json({ message: 'File not found at the specified index' });
      }

      // Respond with the date_init property
      res.status(200).json(file.date_init);
    } catch (error) {
      console.error('Error fetching file time:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
