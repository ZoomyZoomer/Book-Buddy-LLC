import connectToDatabase from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, index } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's bookshelf
      const shelf = await Bookshelf.findOne({ username: username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Check if the item at the provided index has already been claimed
      const entryIndex = shelf.total_entries.length - 1 - index;
      if (shelf.total_entries[entryIndex]?.is_claimed) {
        return res.status(400).json({ message: 'Item already claimed' });
      }

      // Mark the entry as claimed
      shelf.total_entries[entryIndex].is_claimed = true;
      await shelf.save();

      // Send success response
      res.status(200).json({ message: 'Item marked as claimed' });

    } catch (e) {
      console.error('Error claiming item:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
