import { connectToDatabase } from './utils/db'; // Adjust the path to your database utility
import Bookshelf from './models/Bookshelf'; // Adjust the path to your Bookshelf model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, volumeId } = req.body;

    try {
      // Connect to the database
      await connectToDatabase();

      // Find the user's bookshelf
      const shelf = await Bookshelf.findOne({ username });
      if (!shelf) {
        return res.status(404).json({ message: 'Bookshelf not found' });
      }

      // Find the "Favorites" tab
      const tab = shelf.tabs.find(tab => tab.tab_name === 'Favorites');
      if (!tab) {
        return res.status(404).json({ message: 'Favorites tab not found' });
      }

      // Find the relevant book in the tab
      const rel_book = tab.books.find(book => book.volume_id === volumeId);
      if (!rel_book) {
        return res.status(404).json({ message: 'Book not found in Favorites tab' });
      }

      // Toggle the pinned status
      rel_book.is_pinned = !rel_book.is_pinned;

      // Save the updated bookshelf
      await shelf.save();

      // Respond with success
      res.status(200).json({ message: 'Book successfully pinned' });

    } catch (e) {
      console.error('Error pinning book:', e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle invalid methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
