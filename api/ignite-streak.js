import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Fetch the user's bookshelf
      const shelf = await Bookshelf.findOne({ username: username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Check if streak has already been claimed or streak_today is false
      if (shelf.streak_claimed) {
        return res.status(400).json({ message: 'Streak already ignited' });
      }

      // Ignite streak: set streak_claimed to true and increment streak
      shelf.streak_claimed = true;
      shelf.streak += 1;

      await shelf.save();

      // Send success response
      res.status(200).json({ message: 'Streak Ignited' });

    } catch (e) {
      console.error('Error igniting streak:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
