import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username, volumeId } = req.query;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the 'Favorites' tab
      const tab = shelf.tabs.find((tab) => tab.tab_name === 'Favorites');
      if (!tab) {
        return res.status(404).json({ message: 'Favorites tab not found' });
      }

      // Find the book in the tab
      const rel_book = tab.books.find((book) => book.volume_id === volumeId);
      if (!rel_book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Return the book details
      return res.status(200).json(rel_book);

    } catch (e) {
      console.error('Error fetching book:', e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
