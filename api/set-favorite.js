import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, volume_id, tab_name } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the appropriate tab
      const tab = shelf.tabs.find(tab => tab.tab_name === tab_name);
      if (!tab) {
        return res.status(404).json({ message: 'Tab not found' });
      }

      // Find the book in the tab
      const book = tab.books.find(book => book.volume_id === volume_id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Toggle the favorite status
      book.is_favorite = !book.is_favorite;

      // Save the updated bookshelf
      await shelf.save();

      // Respond with success
      res.status(200).json({ message: 'Favorite status updated' });

    } catch (e) {
      console.error('Error toggling favorite:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
